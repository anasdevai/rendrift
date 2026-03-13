require('dotenv').config();
const { suggestKeyframes } = require('./lib/ai');
const path = require('path');

const videoPath = 'd:/project_tool/03-54-57.mp4';
const duration = 10; // Placeholder, adjust if possible

console.log('--- TESTING AI SUGGESTIONS ---');
console.log('Video:', videoPath);

async function runTest() {
    try {
        const keyframes = await suggestKeyframes(videoPath, duration);
        console.log('SUCCESS! Keyframes:', JSON.stringify(keyframes, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('FAILED!');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.stack) console.error('Stack Trace:', err.stack);
        console.error('Full Error Object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
        process.exit(1);
    }
}

runTest();
