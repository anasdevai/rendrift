const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const ffmpegPath = path.join(__dirname, 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
if (fs.existsSync(ffmpegPath)) {
    ffmpeg.setFfmpegPath(ffmpegPath);
}

const inputPath = path.join(__dirname, '../../03-54-57.mp4');
const outputPath = path.join(__dirname, 'test-render-output-final.mp4');

// Minimal zoompan
ffmpeg(inputPath)
    .videoFilters("zoompan=z=1.2:x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2):d=1:s=1280x720")
    .outputOptions(['-c:v libx264', '-t 5'])
    .output(outputPath)
    .on('start', (cmd) => console.log('Command:', cmd))
    .on('end', () => console.log('Done! Output at:', outputPath))
    .on('error', (err) => console.error('Error:', err))
    .run();
