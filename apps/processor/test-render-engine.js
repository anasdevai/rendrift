const path = require('path');
const fs = require('fs');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');

async function renderWithRemotion(inputPath, outputPath, script) {
    console.log(`[Remotion] Starting render for ${outputPath}`);
    const entryPath = path.resolve(__dirname, 'renderer/src/index.tsx');
    const bundleLocation = await bundle({
        entryPoint: entryPath,
    });
    const inputProps = {
        videoSrc: `file://${inputPath}`,
        background: script.background,
        keyframes: script.keyframes.map(kf => ({
            timestamp: kf.time,
            zoom: kf.zoom,
            focalX: kf.focalX,
            focalY: kf.focalY,
            tiltX: script.baseStyle.tiltX,
            tiltY: script.baseStyle.tiltY
        }))
    };
    const composition = await selectComposition({
        bundle: bundleLocation,
        id: 'FocusCast',
        inputProps,
    });
    const ffmpegExecutable = path.resolve(__dirname, 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
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

const mockScript = {
    duration: 3,
    background: 'blur-gradient',
    baseStyle: { tiltX: 5, tiltY: 2, borderRadius: 15, shadowIntensity: 0.6 },
    keyframes: [
        { time: 0, zoom: 1.0, focalX: 50, focalY: 50 },
        { time: 1.5, zoom: 1.8, focalX: 20, focalY: 80 },
        { time: 3, zoom: 1.0, focalX: 50, focalY: 50 }
    ]
};

const input = path.resolve(__dirname, 'uploads/raw/test-job-001.mp4');
const output = path.resolve(__dirname, 'uploads/processed/proof-render.mp4');

renderWithRemotion(input, output, mockScript)
    .then(() => console.log('Successfully rendered proof-render.mp4'))
    .catch(err => console.error('Render failed:', err));
