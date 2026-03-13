const { OpenAI } = require('openai');
const { Agent, run, extractAllTextOutput, setDefaultModelProvider, user } = require('@openai/agents');
const { OpenAIProvider, setDefaultOpenAIKey } = require('@openai/agents-openai');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const os = require('os');

// Point to Remotion's ffmpeg and ffprobe binaries
const ffmpegPath = path.join(__dirname, '../node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const ffprobePath = path.join(__dirname, '../node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');

if (fs.existsSync(ffmpegPath)) {
    ffmpeg.setFfmpegPath(ffmpegPath);
}
if (fs.existsSync(ffprobePath)) {
    ffmpeg.setFfprobePath(ffprobePath);
}

// Satisfy creditial check for OpenAI provider
if (process.env.OPENROUTER_API_KEY) {
    setDefaultOpenAIKey(process.env.OPENROUTER_API_KEY);
}

// Initialize OpenAI client for OpenRouter
const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://focuscast.app',
        'X-Title': 'FocusCast AI Engine',
    },
});

// Set the default model provider to OpenRouter via OpenAIProvider
setDefaultModelProvider(new OpenAIProvider({
    openAIClient: client
}));

/**
 * AI Agent designed to optimize cinematic camera paths with visual awareness.
 */
const CinematicAgent = new Agent({
    name: 'FocusCast Pro Director',
    model: 'openrouter/free',
    instructions: `
    You are an elite cinematic director for high-end product demos.
    Your goal is to transform a static screen recording into a dynamic, "Apple-style" 3D masterpiece.

    PRINCIPLES:
    1. **Semantic Focus**: Identify where the action is (buttons, text inputs, code) and center the camera there.
    2. **Liquid Motion**: Avoid static shots. Use slow, continuous pans or "drifts" (subtle tilt/zoom changes).
    3. **Impact Zooms**: When a major action happens (like a click or search), zoom in (up to 2.2x) to create focus.
    4. **Cinematic Easing**: Place keyframes every 2-4 seconds to ensure the Remotion engine has points to interpolate smoothly.
    5. **Golden Rule**: Never tilt more than 15 degrees. Keep it professional.

    INPUT DATA:
    - You will receive the video duration.
    - You will receive descriptions of frames at specific timestamps.

    OUTPUT:
    - Return a JSON object with a "keyframes" array.
    - Each keyframe MUST have: timestamp, tiltX, tiltY, zoom, focalX, focalY.
  `,
});

/**
 * Extracts frames from a video at specific intervals for visual context.
 */
async function extractFrames(videoPath, duration) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'focuscast-'));
    const frameCount = 3;
    const intervals = [0.1, 0.5, 0.9]; // Start, Middle, near End
    const frames = [];

    for (let i = 0; i < frameCount; i++) {
        const timestamp = duration * intervals[i];
        const filename = `frame-${i}.jpg`;
        const outputPath = path.join(tmpDir, filename);

        try {
            await new Promise((resolve, reject) => {
                ffmpeg(videoPath)
                    .screenshots({
                        timestamps: [timestamp],
                        filename: filename,
                        folder: tmpDir,
                        size: '640x?'
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            if (fs.existsSync(outputPath)) {
                const base64 = fs.readFileSync(outputPath, { encoding: 'base64' });
                frames.push({ timestamp, data: base64 });
            }
        } catch (e) {
            console.warn(`Failed to extract frame at ${timestamp}s:`, e.message);
        }
    }

    // Cleanup temp dir after small delay
    setTimeout(() => {
        try { if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) { }
    }, 10000);
    return frames;
}

async function suggestKeyframes(videoPath, duration) {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY is not set');
    }

    try {
        console.log('Extracting frames for visual context...');
        const frames = await extractFrames(videoPath, duration);

        const promptText = `The video is ${duration.toFixed(2)} seconds long. Here are ${frames.length} frames from across the video duration. Analyze the UI and movements to create a cinematic 3D sequence.`;
        const visualContent = [
            { type: 'input_text', text: promptText },
            ...frames.map(f => ({
                type: 'input_image',
                image: `data:image/jpeg;base64,${f.data}`
            }))
        ];

        let attempt = 0;
        let suggestionText = null;

        while (attempt < 3 && !suggestionText) {
            try {
                // Wrap in a user message as required by the run() function
                const inputItems = [user(visualContent)];

                console.log(`Calling AI agent (Attempt ${attempt + 1})...`);
                const runResult = await run(CinematicAgent, inputItems, {
                    modelSettings: { max_tokens: 1000 }
                });

                suggestionText = extractAllTextOutput(runResult.items);
                console.log('AI Response Length:', suggestionText.length);
            } catch (err) {
                console.warn(`AI Attempt ${attempt + 1} failed:`, err.message);
                if (err.message.includes('429')) {
                    await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
                }
                attempt++;
                if (attempt === 3) {
                    console.warn('AI Agent failed after 3 attempts. Falling back to default cinematic sequence to bypass OpenRouter limits.');
                    const fallbackKeyframes = [
                        { timestamp: 0, tiltX: 0, tiltY: 0, zoom: 1, focalX: 50, focalY: 50 },
                        { timestamp: duration * 0.2, tiltX: 5, tiltY: -5, zoom: 1.2, focalX: 40, focalY: 60 },
                        { timestamp: duration * 0.5, tiltX: -3, tiltY: 4, zoom: 1.5, focalX: 60, focalY: 40 },
                        { timestamp: duration * 0.8, tiltX: 4, tiltY: 2, zoom: 1.1, focalX: 50, focalY: 50 },
                        { timestamp: duration, tiltX: 0, tiltY: 0, zoom: 1, focalX: 50, focalY: 50 }
                    ];
                    return fallbackKeyframes;
                }
            }
        }

        if (!suggestionText) {
            console.warn('Failed to get a valid response from the AI agent. Using fallback sequence.');
            const fallbackKeyframes = [
                { timestamp: 0, tiltX: 0, tiltY: 0, zoom: 1, focalX: 50, focalY: 50 },
                { timestamp: duration * 0.5, tiltX: 5, tiltY: -5, zoom: 1.3, focalX: 50, focalY: 50 },
                { timestamp: duration, tiltX: 0, tiltY: 0, zoom: 1, focalX: 50, focalY: 50 }
            ];
            return fallbackKeyframes;
        }

        const cleanContent = suggestionText.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanContent);

        return (data.keyframes || []).sort((a, b) => a.timestamp - b.timestamp);
    } catch (err) {
        console.error('AI SDK Suggestion Error:', err);
        throw err;
    }
}

module.exports = { suggestKeyframes };
