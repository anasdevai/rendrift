const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/init');
const authMiddleware = require('../lib/middleware');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

// Set explicit paths for ffmpeg and ffprobe (using Remotion bundles)
const ffmpegPath = path.resolve(__dirname, '../../node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const ffprobePath = path.resolve(__dirname, '../../node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/raw/'));
    },
    filename: (req, file, cb) => {
        const jobId = uuidv4();
        req.jobId = jobId; // Pass jobId to the route handler
        cb(null, `${jobId}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Create/Upload Job
router.post('/create', authMiddleware, upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
    }

    const jobId = req.jobId;
    const inputPath = req.file.path;

    // Validate video duration (max 2 minutes)
    try {
        const duration = await getVideoDuration(inputPath);
        if (duration > 120) {
            return res.status(400).json({ error: 'Video must be under 2 minutes for free tier' });
        }
    } catch (err) {
        console.error('Duration check failed:', err);
    }

    try {
        const insertJob = db.prepare(`
            INSERT INTO jobs (id, user_id, status, current_step, input_path)
            VALUES (?, ?, 'pending', 'queued', ?)
        `);
        insertJob.run(jobId, req.user.id, inputPath);

        // Fire-and-forget call to Python agent
        const agentUrl = process.env.AGENT_SERVER_URL || 'http://localhost:8000';
        axios.post(`${agentUrl}/agent/run`, {
            jobId,
            inputPath
        }).catch(err => {
            console.error(`Agent call failed for job ${jobId}:`, err.message);
            db.prepare(`
                UPDATE jobs SET status='error', error_message=?, updated_at=datetime('now') 
                WHERE id=?
            `).run('Failed to start agent pipeline', jobId);
        });

        res.status(201).json({ jobId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to get video duration
function getVideoDuration(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration);
        });
    });
}

// Get Job Status
router.get('/:jobId', authMiddleware, (req, res) => {
    try {
        const getJob = db.prepare('SELECT * FROM jobs WHERE id = ? AND user_id = ?');
        const job = getJob.get(req.params.jobId, req.user.id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json({
            id: job.id,
            status: job.status,
            currentStep: job.current_step,
            outputPath: job.output_path,
            errorMessage: job.error_message,
            renderScript: job.render_script ? JSON.parse(job.render_script) : null,
            tokenUsed: job.token_used,
            createdAt: job.created_at,
            updatedAt: job.updated_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get User Jobs
router.get('/', authMiddleware, (req, res) => {
    try {
        const getUserJobs = db.prepare('SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC');
        const jobs = getUserJobs.all(req.user.id);

        res.json({
            jobs: jobs.map(job => ({
                id: job.id,
                status: job.status,
                currentStep: job.current_step,
                outputPath: job.output_path,
                createdAt: job.created_at
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
