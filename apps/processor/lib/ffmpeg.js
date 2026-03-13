const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const db = require('../db/init');

// Point to Remotion's ffmpeg and ffprobe binaries
const ffmpegPath = path.join(__dirname, '../node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const ffprobePath = path.join(__dirname, '../node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');

if (fs.existsSync(ffmpegPath)) {
    ffmpeg.setFfmpegPath(ffmpegPath);
}
if (fs.existsSync(ffprobePath)) {
    ffmpeg.setFfprobePath(ffprobePath);
}


async function processVideo(jobId, inputPath, settings) {
    const outputPath = path.join(__dirname, `../uploads/processed/${jobId}.mp4`);

    // Update status to processing
    db.prepare("UPDATE jobs SET status = 'processing', updated_at = datetime('now') WHERE id = ?").run(jobId);

    const { keyframes = [], background = 'dark-gradient' } = settings;

    // Get video duration using ffprobe
    const duration = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputPath, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata.format.duration);
        });
    });

    const fps = 30;
    const durationInFrames = Math.floor(duration * fps);

    // We'll use Remotion for the advanced animations
    const fileName = path.basename(inputPath);
    const videoUrl = `http://localhost:${process.env.PORT || 3001}/uploads/raw/${fileName}`;

    const props = {
        videoSrc: videoUrl,
        keyframes,
        background
    };
    const propsPath = path.join(__dirname, `../uploads/processed/props-${jobId}.json`);
    fs.writeFileSync(propsPath, JSON.stringify(props));

    const rendererPath = path.join(__dirname, '../renderer');

    return new Promise((resolve, reject) => {
        const remotionBin = path.join(__dirname, '../node_modules/.bin/remotion.cmd');
        const cmd = `"${remotionBin}" render src/index.tsx FocusCast ${outputPath} --props=${propsPath} --duration=${durationInFrames}`;

        console.log(`Running Remotion: ${cmd}`);

        const child = exec(cmd, { cwd: rendererPath }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Remotion error: ${error.message}`);
                console.error(`Remotion stderr: ${stderr}`);
                db.prepare("UPDATE jobs SET status = 'error', error_message = ?, updated_at = datetime('now') WHERE id = ?")
                    .run(stderr || error.message, jobId);
                cleanup(inputPath);
                cleanup(propsPath);
                return reject(error);
            }

            console.log('Remotion finished successfully');
            console.log('Remotion stdout:', stdout);
            db.prepare("UPDATE jobs SET status = 'done', output_path = ?, updated_at = datetime('now') WHERE id = ?")
                .run(outputPath, jobId);
            cleanup(inputPath);
            cleanup(propsPath);
            resolve();
        });

        // Log progress if possible
        let lastDbUpdate = 0;
        if (child.stdout) {
            child.stdout.on('data', (data) => {
                const text = data.toString().trim();
                console.log(`[Remotion ${jobId}]: ${text}`);

                // Match strings like: "15% [======...] 503/3307, time remaining: 14m"
                const match = text.match(/(\d+)\/(\d+), time remaining/);
                if (match) {
                    const current = parseInt(match[1]);
                    const total = parseInt(match[2]);
                    if (total > 0) {
                        const progress = Math.round((current / total) * 100);
                        if (progress - lastDbUpdate >= 5 || progress === 100) {
                            lastDbUpdate = progress;
                            try {
                                db.prepare("UPDATE jobs SET progress = ? WHERE id = ?").run(progress, jobId);
                            } catch (e) {
                                console.warn('Failed to update progress', e.message);
                            }
                        }
                    }
                }
            });
        }

    });

}


function cleanup(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Cleaned up file:', filePath);
        }
    } catch (err) {
        console.warn('Cleanup failed for:', filePath, err.message);
    }
}

module.exports = { processVideo };
