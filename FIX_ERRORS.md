# Fix Current Errors

## Error 1: Database Missing `current_step` Column

**Error Message:**
```
SqliteError: table jobs has no column named current_step
```

**Solution:**

1. **Stop the Node.js server** (Press Ctrl+C in the terminal running `node index.js`)

2. **Run the migration script:**
```bash
cd apps/processor/db
node migrate.js
```

3. **Restart the Node.js server:**
```bash
cd apps/processor
node index.js
```

The migration script will:
- Backup your existing database
- Add missing columns (`current_step`, `render_script`, `token_used`)
- Preserve existing data

---

## Error 2: FFmpeg Not Found

**Error Message:**
```
Duration check failed: Error: Cannot find ffprobe
```

**Solution:**

### Windows Installation

1. **Download FFmpeg:**
   - Go to: https://www.gyan.dev/ffmpeg/builds/
   - Download: `ffmpeg-release-essentials.zip`
   - Or direct link: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.7z

2. **Extract the archive:**
   - Extract to: `C:\ffmpeg`
   - You should have: `C:\ffmpeg\bin\ffmpeg.exe`

3. **Add to PATH:**
   
   **Option A: Using PowerShell (Recommended)**
   ```powershell
   # Run PowerShell as Administrator
   $env:Path += ";C:\ffmpeg\bin"
   [Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableTarget]::Machine)
   ```

   **Option B: Using GUI**
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\ffmpeg\bin`
   - Click "OK" on all dialogs

4. **Verify installation:**
   ```bash
   # Close and reopen terminal
   ffmpeg -version
   ffprobe -version
   ```

### Alternative: Chocolatey (Windows Package Manager)

If you have Chocolatey installed:
```bash
choco install ffmpeg
```

### Alternative: Scoop (Windows Package Manager)

If you have Scoop installed:
```bash
scoop install ffmpeg
```

---

## Quick Fix Script

I've created a script to help you fix both issues:

```bash
# 1. Stop Node.js server (Ctrl+C)

# 2. Run migration
cd apps/processor/db
node migrate.js

# 3. Install FFmpeg (choose one method above)

# 4. Verify FFmpeg
ffmpeg -version

# 5. Restart Node.js server
cd apps/processor
node index.js
```

---

## Verification

After fixing both issues, you should see:

**Node.js server output:**
```
Processor server running on port 4001
```

No errors about:
- ❌ "Cannot find ffprobe"
- ❌ "table jobs has no column named current_step"

**Test FFmpeg:**
```bash
ffmpeg -version
# Should show: ffmpeg version N-xxxxx-gxxxxxxx
```

**Test Database:**
```bash
cd apps/processor/db
node -e "const db = require('./init'); console.log(db.prepare('PRAGMA table_info(jobs)').all())"
# Should show all columns including current_step
```

---

## If Migration Fails

If the migration script fails, you can recreate the database from scratch:

**⚠️ WARNING: This will delete all existing data!**

```bash
# Stop Node.js server (Ctrl+C)

cd apps/processor/db

# Delete old database
del focuscast.db
del focuscast.db-shm
del focuscast.db-wal

# Recreate with correct schema
node init.js

# Restart server
cd ..
node index.js
```

---

## After Fixing

Once both issues are resolved:

1. **Restart all services:**
   ```bash
   # Terminal 1: Python Agent
   cd apps/processor/agent
   uv run uvicorn main:app --host 0.0.0.0 --port 8000

   # Terminal 2: Node.js Backend
   cd apps/processor
   node index.js

   # Terminal 3: Next.js Frontend
   cd apps/web
   npm run dev
   ```

2. **Test the application:**
   - Open: http://localhost:3000
   - Sign up / Log in
   - Upload a video
   - Watch it process

---

## Still Having Issues?

### Check FFmpeg Installation
```bash
where ffmpeg
# Should show: C:\ffmpeg\bin\ffmpeg.exe (or similar)
```

### Check Database Schema
```bash
cd apps/processor/db
sqlite3 focuscast.db ".schema jobs"
# Should show current_step column
```

### Check Environment Variables
```bash
cd apps/processor
type .env
# Should show OPENROUTER_API_KEY and other vars
```

### Check All Services Running
```bash
# From project root
node test-setup.js
```

---

## Summary

1. ✅ Run `node apps/processor/db/migrate.js` to fix database
2. ✅ Install FFmpeg and add to PATH
3. ✅ Restart Node.js server
4. ✅ Test with `node test-setup.js`
5. ✅ Start all 3 services
6. ✅ Test at http://localhost:3000
