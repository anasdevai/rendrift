const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db/init');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');

// Render execution endpoint (called by Python agent)
router.post('/execute', async (req, res) => {
    const { renderScript, jobId } = req.body;

    if (!renderScript || !jobId) {
        return res.status(400).json({ error: 'Missing renderScript or jobId' });
    }

    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId);
    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    const inputPath = job.input_path;
    const outputPath = path.join(__dirname, '../uploads/processed', `${jobId}.mp4`);

    // Save script for debugging and frontend use
    db.prepare('UPDATE jobs SET render_script = ? WHERE id = ?').run(JSON.stringify(renderScript), jobId);

    // Respond immediately - Render runs async
    res.json({ accepted: true, jobId });

    try {
        await renderWithRemotion(inputPath, outputPath, renderScript, jobId);

        // Update with relative path for frontend download
        const relativeOutputPath = `uploads/processed/${jobId}.mp4`;
        db.prepare(`
            UPDATE jobs 
            SET status='done', output_path=?, current_step='complete', updated_at=datetime('now') 
            WHERE id=?
        `).run(relativeOutputPath, jobId);

        console.log(`[Render] Job ${jobId} completed successfully via Remotion`);

    } catch (err) {
        console.error(`Remotion failed for job ${jobId}:`, err);
        db.prepare(`
            UPDATE jobs 
            SET status='error', error_message=?, updated_at=datetime('now') 
            WHERE id=?
        `).run(err.message, jobId);
    } finally {
        // Clean up raw input file to save disk space
        try {
            if (fs.existsSync(inputPath)) {
                fs.unlinkSync(inputPath);
            }
        } catch (cleanupErr) {
            console.error(`Cleanup failed for ${inputPath}:`, cleanupErr);
        }
    }
});

async function renderWithRemotion(inputPath, outputPath, script, jobId) {
    console.log(`[Remotion] Starting render for ${outputPath}`);

    // The remotion project is in the 'renderer' subdirectory
    const entryPath = path.resolve(__dirname, '../renderer/src/index.tsx');

    // Create a bundle
    const bundleLocation = await bundle({
        entryPoint: entryPath,
        webpackOverride: (config) => config,
    });

    // Map agent's RenderScript to FocusComposition props
    const inputProps = {
        videoSrc: `http://localhost:4001/uploads/raw/${path.basename(inputPath)}`,
        background: script.background,
        keyframes: script.keyframes.map(kf => ({
            time: kf.time,
            zoom: kf.zoom,
            focalX: kf.focalX,
            focalY: kf.focalY,
            tiltX: script.baseStyle.tiltX,
            tiltY: script.baseStyle.tiltY
        }))
    };

    // Select the composition
    const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'FocusCast',
        inputProps,
    });

    // Use Remotion's ffmpeg binary from node_modules
    const ffmpegExecutable = path.resolve(__dirname, '../node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');

    // Perform the render
    await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps,
        durationInFrames: Math.ceil(script.duration * composition.fps),
        ffmpegExecutable: fs.existsSync(ffmpegExecutable) ? ffmpegExecutable : undefined,
    });

    console.log(`[Remotion] Render complete: ${outputPath}`);
}

module.exports = router;
