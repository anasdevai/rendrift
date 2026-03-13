# FocusCast AI - Quick Start Guide

## ⚠️ First Time Setup

### Fix Database Schema (One-time)
```bash
cd apps/processor/db
node migrate.js
cd ../..
```

### Install FFmpeg (One-time)
1. Download: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
2. Extract to: `C:\ffmpeg`
3. Add to PATH: `C:\ffmpeg\bin`
4. Verify: `ffmpeg -version`

**See FIX_ERRORS.md for detailed instructions**

---

## 🚀 Start in 3 Steps

### Step 1: Verify Setup (30 seconds)
```bash
node test-setup.js
```

### Step 2: Start Services (Open 3 terminals)

**Terminal 1 - Python Agent:**
```bash
cd apps/processor/agent
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Node.js Backend:**
```bash
cd apps/processor
node index.js
```

**Terminal 3 - Next.js Frontend:**
```bash
cd apps/web
npm run dev
```

### Step 3: Test
Open browser: http://localhost:3000

---

## 🎯 Quick Test Flow

1. **Sign Up**: http://localhost:3000/auth/signup
   - Email: test@example.com
   - Password: password123

2. **Upload Video**: http://localhost:3000/upload
   - Drag & drop a screen recording
   - Max 100MB, 2 minutes

3. **Watch Progress**: Redirects to /status/{jobId}
   - Polls every 3 seconds
   - Shows: analyzing → directing → rendering → done

4. **Download**: Click download button when complete

---

## 🔍 Health Checks

```bash
# Python Agent
curl http://localhost:8000/health

# Node.js Backend
curl http://localhost:4001/health

# Frontend
Open http://localhost:3000
```

---

## ⚡ Windows Quick Start

Double-click: `start-all.bat`

This opens 3 terminal windows automatically.

---

## 🐛 Common Issues

### "API key not set"
```bash
# Check .env file exists
cat apps/processor/.env

# Should contain:
OPENROUTER_API_KEY=sk-or-v1-...
```

### "FFmpeg not found"
```bash
# Install FFmpeg
# Windows: Download from ffmpeg.org
# Mac: brew install ffmpeg
# Linux: sudo apt install ffmpeg

# Verify
ffmpeg -version
```

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

---

## 📊 Expected Output

### Python Agent (Terminal 1)
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Node.js Backend (Terminal 2)
```
Processor server running on port 4001
```

### Next.js Frontend (Terminal 3)
```
ready - started server on 0.0.0.0:3000
```

---

## 📁 Key Files

- `apps/processor/.env` - Backend config
- `apps/web/.env.local` - Frontend config
- `apps/processor/db/focuscast.db` - Database
- `apps/processor/uploads/` - Video storage

---

## 💡 Tips

- Keep all 3 terminals open while testing
- Check terminal logs for errors
- First job may take longer (cold start)
- Processing time: ~30-180 seconds per video
- Cost: <$0.001 per job

---

## 📚 More Info

- Full guide: `TESTING_GUIDE.md`
- Project status: `PROJECT_STATUS.md`
- Implementation: `IMPLEMENTATION_TODO.md`

---

## ✅ Success Checklist

- [ ] All 3 services running
- [ ] Health checks return OK
- [ ] Can sign up/login
- [ ] Can upload video
- [ ] Job processes successfully
- [ ] Can download result

---

**Need Help?** Check `TESTING_GUIDE.md` for detailed troubleshooting.
