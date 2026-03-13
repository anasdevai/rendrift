const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { suggestKeyframes } = require('../lib/ai');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const authMiddleware = require('../lib/middleware');

router.post('/:id/magic-edit', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const job = db.prepare('SELECT * FROM jobs WHERE id = ? AND user_id = ?').get(id, req.user.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        // Get duration if not already in DB
        const videoPath = job.input_path;
        const duration = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) reject(err);
                else resolve(metadata.format.duration);
            });
        });

        const suggestions = await suggestKeyframes(videoPath, duration);

        res.json({ keyframes: suggestions });
    } catch (err) {
        console.error('Magic Edit Route Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
