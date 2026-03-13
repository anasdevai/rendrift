const { renderWithRemotion } = require('./apps/processor/renderer/render.js');
const path = require('path');

const mockScript = {
    duration: 5,
    background: 'dark-gradient',
    baseStyle: {
        tiltX: 8,
        tiltY: 4,
        borderRadius: 12,
        shadowIntensity: 0.5
    },
    keyframes: [
        { time: 0, zoom: 1.0, focalX: 50, focalY: 50, easingIn: 'linear', easingOut: 'linear', reason: 'Start' },
        { time: 2, zoom: 2.0, focalX: 30, focalY: 30, easingIn: 'ease-in-out', easingOut: 'ease-in-out', reason: 'Click' },
        { time: 5, zoom: 1.0, focalX: 50, focalY: 50, easingIn: 'ease-out', easingOut: 'linear', reason: 'End' }
    ]
};

const jobId = 'render-proof-' + Date.now();
const videoSrc = path.resolve('apps/processor/uploads/raw/test-job-001.mp4');

console.log('Starting hardware-accelerated 3D render test...');
renderWithRemotion(mockScript, jobId, videoSrc)
    .then(outputPath => {
        console.log('SUCCESS! Render completed at:', outputPath);
        process.exit(0);
    })
    .catch(err => {
        console.error('RENDER FAILED:', err);
        process.exit(1);
    });
