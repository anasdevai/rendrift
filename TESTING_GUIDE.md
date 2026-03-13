# FocusCast AI - Testing Guide

## Prerequisites

1. **FFmpeg**: Ensure FFmpeg is installed and in your system PATH
   - Download from: https://ffmpeg.org/download.html
   - Test: `ffmpeg -version`

2. **Node.js**: Version 16+ required
   - Test: `node --version`

3. **Python**: Version 3.12+ required
   - Test: `python --version`

4. **UV**: Python package manager
   - Test: `uv --version`

## Setup Steps

### 1. Install Node.js Dependencies

```bash
# Backend
cd apps/processor
npm install

# Frontend
cd ../web
npm install
```

### 2. Install Python Dependencies

```bash
cd apps/processor/agent
uv sync
# or if sync is slow:
uv pip install fastapi uvicorn openai opencv-python-headless pillow pydantic httpx python-multipart python-dotenv
```

### 3. Verify Environment Variables

Check `apps/processor/.env`:
```env
JWT_SECRET=supersecretfocuscastkey12345
PORT=4001
NODE_ENV=development
OPENROUTER_API_KEY=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
OPENAI_BASE_URL=https://openrouter.ai/api/v1
AGENT_SERVER_URL=http://localhost:8000
DB_PATH=./db/focuscast.db
```

Check `apps/web/.env.local`:
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:4001
```

## Running the Application

You need to run 3 servers simultaneously. Open 3 terminal windows:

### Terminal 1: Python Agent Server

```bash
cd apps/processor/agent
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Node.js Backend

```bash
cd apps/processor
node index.js
```

Expected output:
```
Processor server running on port 4001
```

### Terminal 3: Next.js Frontend

```bash
cd apps/web
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Testing the Application

### 1. Health Checks

Test each service is running:

```bash
# Python Agent
curl http://localhost:8000/health

# Node.js Backend
curl http://localhost:4001/health

# Frontend (open in browser)
http://localhost:3000
```

### 2. User Flow Test

1. **Sign Up**
   - Navigate to: http://localhost:3000/auth/signup
   - Enter email and password
   - Should redirect to /upload

2. **Upload Video**
   - Go to: http://localhost:3000/upload
   - Drag and drop a screen recording (.mp4, .webm, .mov)
   - Max size: 100MB, Max duration: 2 minutes
   - Click "Generate Professional Video"
   - Should redirect to /status/{jobId}

3. **Monitor Progress**
   - Status page polls every 3 seconds
   - Watch the progress steps:
     - ✓ Upload received
     - ⟳ Extracting frames
     - ⟳ AI analyzing video
     - ⟳ Generating render script
     - ⟳ Rendering video
     - ✓ Complete

4. **Download Result**
   - When complete, video player shows before/after comparison
   - Click "Download" button
   - Video should download as {jobId}.mp4

### 3. API Testing

Test individual endpoints:

```bash
# Sign up
curl -X POST http://localhost:4001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create job (requires token from login)
curl -X POST http://localhost:4001/api/jobs/create \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "video=@path/to/your/video.mp4"

# Get job status
curl http://localhost:4001/api/jobs/JOB_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Python Agent Won't Start

**Error**: `OpenAIError: The api_key client option must be set`

**Solution**: The .env file should be loaded automatically. If not:
```bash
# Set environment variable manually
export OPENROUTER_API_KEY="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"
export DB_PATH="../db/focuscast.db"
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

### FFmpeg Not Found

**Error**: `FFmpeg/avconv not found!`

**Solution**: 
1. Install FFmpeg from https://ffmpeg.org/download.html
2. Add to system PATH
3. Restart terminal
4. Test: `ffmpeg -version`

### Database Errors

**Error**: `SQLITE_ERROR: no such table: jobs`

**Solution**: Initialize the database:
```bash
cd apps/processor
node db/init.js
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**: Kill the process using the port:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### OpenCV Installation Issues

If opencv-python-headless takes too long to install:

```bash
# Try installing a pre-built wheel
uv pip install opencv-python-headless --only-binary opencv-python-headless

# Or use regular opencv-python (includes GUI, larger)
uv pip install opencv-python
```

Then update `apps/processor/agent/lib/frames.py`:
```python
import cv2  # works with either opencv-python or opencv-python-headless
```

## Expected Behavior

### Successful Job Flow

1. **Upload** (status: pending)
   - Video saved to `apps/processor/uploads/raw/{jobId}.mp4`
   - Job created in database

2. **Analyzing** (status: analyzing)
   - Frames extracted to `/tmp/frames_{jobId}/`
   - AI analyzes frames for UI events
   - ~10-30 frames processed

3. **Directing** (status: directing)
   - AI generates cinematic render script
   - Script saved to database

4. **Rendering** (status: rendering)
   - FFmpeg applies 3D effects
   - Output saved to `apps/processor/uploads/processed/{jobId}.mp4`
   - Raw input deleted

5. **Done** (status: done)
   - Video ready for download
   - Temp frames cleaned up

### Processing Time

- Short video (30 sec): ~30-60 seconds
- Medium video (1 min): ~60-120 seconds
- Long video (2 min): ~120-180 seconds

### Cost Per Job

- Analyst Agent (Gemini Flash 1.5): ~$0.0005
- Director Agent (Llama 3.1 8B): Free
- Total: <$0.001 per job

## Logs

Check logs for debugging:

```bash
# Python Agent (in terminal)
# Shows: [Pipeline] Starting for job {jobId}
# Shows: [Analyst] Batch {i} failed: {error}
# Shows: [Director] Failed: {error}. Using fallback script.

# Node.js Backend
tail -f apps/processor/processor.log
tail -f apps/processor/web.log

# Frontend (in browser console)
# Shows API calls and responses
```

## Database Inspection

```bash
cd apps/processor/db
sqlite3 focuscast.db

# View all jobs
SELECT id, status, current_step, created_at FROM jobs;

# View specific job
SELECT * FROM jobs WHERE id = 'YOUR_JOB_ID';

# View users
SELECT id, email, created_at FROM users;
```

## Success Criteria

✅ All 3 servers start without errors
✅ Health checks return 200 OK
✅ User can sign up and log in
✅ Video upload creates a job
✅ Job progresses through all statuses
✅ Processed video is generated
✅ Video can be downloaded
✅ Dashboard shows all jobs
✅ No errors in console/logs

## Next Steps After Testing

1. Test with different video types (screen recordings, presentations, tutorials)
2. Test edge cases (very short videos, no audio, different resolutions)
3. Monitor OpenRouter usage and costs
4. Optimize FFmpeg settings for quality/speed
5. Add error recovery and retry logic
6. Deploy to production (Render.com + Vercel)

## Support

If you encounter issues:
1. Check all 3 servers are running
2. Verify environment variables are set
3. Check logs for error messages
4. Ensure FFmpeg is installed
5. Verify OpenRouter API key is valid
6. Check database has correct schema
