# FocusCast AI - Implementation TODO
## Step-by-Step Implementation Plan

**Current Status:** Existing project with partial implementation
**Goal:** Complete implementation according to PRD v2.0.0

---

## Phase 1: Infrastructure & Setup ✅ (Verify/Update)

### 1.1 Database Schema
- [ ] Verify SQLite schema in `apps/processor/db/init.js`
  - [ ] Check `users` table structure
  - [ ] Check `jobs` table structure with all required fields
  - [ ] Add missing fields: `token_used`, `render_script`
  - [ ] Verify indexes for performance

### 1.2 Environment Configuration
- [ ] Update `apps/processor/.env` with required variables:
  - [ ] `JWT_SECRET`
  - [ ] `OPENROUTER_API_KEY`
  - [ ] `OPENAI_BASE_URL=https://openrouter.ai/api/v1`
  - [ ] `NODE_SERVER_URL`
  - [ ] `PORT=3001`
- [ ] Update `apps/web/.env.local`:
  - [ ] `NEXT_PUBLIC_SERVER_URL`

### 1.3 Dependencies Audit
- [ ] Review `apps/processor/package.json` - ensure all required packages:
  - [ ] `express`, `cors`, `multer`, `better-sqlite3`
  - [ ] `bcryptjs`, `jsonwebtoken`, `uuid`
  - [ ] `fluent-ffmpeg`, `axios`
- [ ] Review `apps/web/package.json` - ensure:
  - [ ] `react-dropzone` for file upload
  - [ ] `react-player` for video preview
- [ ] Create Python agent requirements (NEW):
  - [ ] Create `apps/processor/agent/requirements.txt`

---

## Phase 2: Backend - Authentication System

### 2.1 Auth Routes (`apps/processor/routes/auth.js`)
- [ ] Implement `POST /api/auth/signup`
  - [ ] Email validation
  - [ ] Password hashing with bcryptjs
  - [ ] SQLite insert
  - [ ] JWT generation
  - [ ] Return `{token, user}`
- [ ] Implement `POST /api/auth/login`
  - [ ] Email lookup
  - [ ] Password verification
  - [ ] JWT generation
  - [ ] Return `{token, user}`

### 2.2 Auth Middleware (`apps/processor/lib/middleware.js`)
- [ ] Create JWT verification middleware
- [ ] Extract user from token
- [ ] Attach `req.user` to request
- [ ] Handle expired/invalid tokens

---

## Phase 3: Backend - Job Management System

### 3.1 Jobs Routes (`apps/processor/routes/jobs.js`)
- [ ] Implement `POST /api/jobs/create`
  - [ ] Auth required
  - [ ] Multer multipart upload (max 100MB)
  - [ ] Video validation (format, size, duration)
  - [ ] Generate UUID for jobId
  - [ ] Save to `/uploads/raw/{jobId}.mp4`
  - [ ] Insert job row in SQLite
  - [ ] Fire-and-forget call to Python agent
  - [ ] Return `{jobId}`
- [ ] Implement `GET /api/jobs/:id`
  - [ ] Auth required
  - [ ] Verify job belongs to user
  - [ ] Return job details
- [ ] Implement `GET /api/jobs`
  - [ ] Auth required
  - [ ] Return all jobs for user
  - [ ] Order by created_at DESC

### 3.2 File Serving Route
- [ ] Implement `GET /uploads/processed/:filename`
  - [ ] Auth required
  - [ ] Verify file exists
  - [ ] Stream video file
  - [ ] Set proper content-type headers

---

## Phase 4: Python Agent Pipeline (NEW COMPONENT)

### 4.1 Project Structure Setup
- [ ] Create `apps/processor/agent/` directory
- [ ] Create subdirectories:
  - [ ] `pipeline/`
  - [ ] `lib/`
  - [ ] `tools/`

### 4.2 Core Agent Files

#### 4.2.1 FastAPI Server (`apps/processor/agent/main.py`)
- [ ] Create FastAPI app
- [ ] Implement `POST /agent/run` endpoint
- [ ] Accept `{jobId, inputPath}`
- [ ] Return immediately (async processing)
- [ ] Call orchestrator in background

#### 4.2.2 Token Management (`apps/processor/agent/lib/tokens.py`)
- [ ] Define all token budget constants
- [ ] Implement `guard_token_budget()` function
- [ ] Implement `should_sample_frame()` function
- [ ] Add frame sampling logic based on video duration

#### 4.2.3 Frame Extraction (`apps/processor/agent/lib/frames.py`)
- [ ] Implement `extract_video_frames()` using OpenCV
- [ ] Extract 1 frame/sec (or less for long videos)
- [ ] Resize frames to 512x288
- [ ] Save as JPEG to `/tmp/frames_{jobId}/`
- [ ] Return frame paths + video duration

#### 4.2.4 Pydantic Schema (`apps/processor/agent/lib/schema.py`)
- [ ] Define `Keyframe` model
- [ ] Define `BaseStyle` model
- [ ] Define `RenderScript` model
- [ ] Add validators for keyframe timing
- [ ] Implement `parse_render_script()` with fallback

#### 4.2.5 Database Helper (`apps/processor/agent/lib/db.py`)
- [ ] Implement `update_job_in_db()` function
- [ ] Connect to SQLite at `DB_PATH`
- [ ] Update status and current_step fields

### 4.3 Agent Definitions

#### 4.3.1 Orchestrator (`apps/processor/agent/pipeline/orchestrator.py`)
- [ ] Configure OpenRouter client with custom base_url
- [ ] Create Orchestrator Agent with exact prompt from PRD
- [ ] Use `meta-llama/llama-3.1-8b-instruct` model
- [ ] Register tools: extract_frames, render_video, update_job_status
- [ ] Register handoffs: analyst_agent, director_agent
- [ ] Implement error handling

#### 4.3.2 Analyst Agent (`apps/processor/agent/pipeline/analyst.py`)
- [ ] Create Analyst Agent with exact prompt from PRD
- [ ] Use `google/gemini-flash-1.5` model
- [ ] Configure for vision input (frames as images)
- [ ] Set max_tokens=800
- [ ] Return events JSON array

#### 4.3.3 Director Agent (`apps/processor/agent/pipeline/director.py`)
- [ ] Create Director Agent with exact prompt from PRD
- [ ] Use `meta-llama/llama-3.1-8b-instruct` model
- [ ] Set max_tokens=1000
- [ ] Return render_script JSON

### 4.4 Tool Implementations (`apps/processor/agent/pipeline/tools.py`)

#### 4.4.1 extract_frames Tool
- [ ] Decorated with `@function_tool`
- [ ] Call `update_job_in_db()` with status='analyzing'
- [ ] Call `extract_video_frames()` from lib
- [ ] Return JSON with frame_paths, duration, total_frames

#### 4.4.2 render_video Tool
- [ ] Decorated with `@function_tool`
- [ ] Call `update_job_in_db()` with status='rendering'
- [ ] POST to Node.js `/render/execute` endpoint
- [ ] Parse render_script JSON
- [ ] Return output_path or error

#### 4.4.3 update_job_status Tool
- [ ] Decorated with `@function_tool`
- [ ] Handle 'done', 'error', and intermediate statuses
- [ ] Update SQLite via `update_job_in_db()`
- [ ] Return confirmation JSON

---

## Phase 5: FFmpeg Rendering Engine

### 5.1 Render Route (`apps/processor/routes/render.js`)
- [ ] Create new route file
- [ ] Implement `POST /render/execute`
- [ ] Accept `{renderScript, jobId}`
- [ ] Respond immediately (async processing)
- [ ] Implement `runFFmpeg()` function:
  - [ ] Parse render script
  - [ ] Map background to color codes
  - [ ] Build FFmpeg complex filter chain:
    - [ ] Background canvas
    - [ ] Video scaling
    - [ ] Perspective transform (3D tilt)
    - [ ] Zoompan to focal point
    - [ ] Vignette effect
    - [ ] Overlay composition
  - [ ] Set output options (H.264, CRF 23, faststart)
  - [ ] Save to `/uploads/processed/{jobId}.mp4`
- [ ] Update job status on completion
- [ ] Clean up raw input file
- [ ] Handle FFmpeg errors

### 5.2 FFmpeg Installation
- [ ] Add FFmpeg to system PATH (local dev)
- [ ] Document FFmpeg installation for deployment
- [ ] Add to Render.com build command

---

## Phase 6: Frontend - Authentication Pages

### 6.1 Login Page (`apps/web/src/app/auth/login/page.tsx`)
- [ ] Create form with email + password
- [ ] Call `POST /api/auth/login`
- [ ] Store JWT in localStorage
- [ ] Redirect to /upload on success
- [ ] Show error messages

### 6.2 Signup Page (`apps/web/src/app/auth/signup/page.tsx`)
- [ ] Create form with email + password + confirm password
- [ ] Client-side validation
- [ ] Call `POST /api/auth/signup`
- [ ] Store JWT in localStorage
- [ ] Redirect to /upload on success
- [ ] Show error messages

### 6.3 API Client (`apps/web/src/lib/api.ts`)
- [ ] Create axios instance with base URL
- [ ] Add JWT interceptor (attach token to headers)
- [ ] Add response interceptor (handle 401)
- [ ] Export typed API functions:
  - [ ] `signup()`, `login()`
  - [ ] `createJob()`, `getJob()`, `getJobs()`

---

## Phase 7: Frontend - Upload Page

### 7.1 Video Uploader Component (`apps/web/src/components/VideoUploader.tsx`)
- [ ] Implement react-dropzone
- [ ] Accept .mp4, .webm, .mov only
- [ ] Max size 100MB validation
- [ ] Show file preview (name, size)
- [ ] Show upload progress
- [ ] "Generate Professional Video" button
- [ ] Call `createJob()` API
- [ ] Redirect to `/status/{jobId}` on success

### 7.2 Upload Page (`apps/web/src/app/upload/page.tsx`)
- [ ] Two-column layout (responsive)
- [ ] Left: VideoUploader component
- [ ] Right: Example cards with before/after demos
- [ ] Auth guard (redirect to /login if not authenticated)

---

## Phase 8: Frontend - Status Page

### 8.1 Job Progress Component (`apps/web/src/components/JobStatusPoller.tsx`)
- [ ] Implement polling logic (every 3 seconds)
- [ ] Call `getJob(jobId)` API
- [ ] Stop polling when status is 'done' or 'error'
- [ ] Display progress steps:
  - [ ] Upload received ✓
  - [ ] Extracting frames (⟳ when active)
  - [ ] AI analyzing video (⟳ when active)
  - [ ] Generating render script (⟳ when active)
  - [ ] Rendering video (⟳ when active)
  - [ ] Complete ✓
- [ ] Map `current_step` to UI labels

### 8.2 Video Comparison Component (`apps/web/src/components/LivePreview.tsx`)
- [ ] Side-by-side video players (before/after)
- [ ] Use react-player
- [ ] Show when status='done'
- [ ] Download button
- [ ] "Start New Project" button

### 8.3 Status Page (`apps/web/src/app/status/[jobId]/page.tsx`)
- [ ] Get jobId from URL params
- [ ] Render JobStatusPoller component
- [ ] Show error state if job fails
- [ ] Show LivePreview when complete
- [ ] Auth guard

---

## Phase 9: Frontend - Dashboard

### 9.1 Video Card Component (`apps/web/src/components/VideoCard.tsx`)
- [ ] Display job thumbnail (first frame or placeholder)
- [ ] Show status badge (processing/done/error)
- [ ] Show created date
- [ ] Download button (if done)
- [ ] Click to view details

### 9.2 Dashboard Page (`apps/web/src/app/dashboard/page.tsx`)
- [ ] Call `getJobs()` API
- [ ] Grid layout of VideoCard components
- [ ] Filter by status (all/done/processing)
- [ ] Sort by date (newest first)
- [ ] Empty state if no jobs
- [ ] Auth guard

---

## Phase 10: Error Handling & Validation

### 10.1 Backend Validation
- [ ] Video file size check (max 100MB)
- [ ] Video duration check (max 2 minutes) using FFprobe
- [ ] File type validation
- [ ] Token budget guards in Python agent
- [ ] Banned models check

### 10.2 Frontend Error Messages
- [ ] File too large error
- [ ] Video too long error
- [ ] Wrong file type error
- [ ] Server cold start message
- [ ] AI analysis failed fallback
- [ ] FFmpeg failed error
- [ ] Quota exceeded error

### 10.3 Graceful Degradation
- [ ] Use FALLBACK_RENDER_SCRIPT if Director fails
- [ ] Continue with empty events if Analyst fails
- [ ] Clean up temp files on error
- [ ] Delete raw files after processing

---

## Phase 11: Testing & Verification

### 11.1 Backend Testing
- [ ] Test auth signup/login flow
- [ ] Test JWT validation
- [ ] Test file upload with various sizes
- [ ] Test video duration validation
- [ ] Test job creation and status updates
- [ ] Test file serving

### 11.2 Agent Pipeline Testing
- [ ] Test frame extraction with different video lengths
- [ ] Test Analyst Agent with sample frames
- [ ] Test Director Agent with sample events
- [ ] Test render_script validation
- [ ] Test fallback script usage
- [ ] Verify token budgets are respected
- [ ] Test OpenRouter integration

### 11.3 FFmpeg Testing
- [ ] Test with different render scripts
- [ ] Verify 3D perspective effect
- [ ] Verify zoom and focal point
- [ ] Verify background colors
- [ ] Test output video quality
- [ ] Verify audio preservation

### 11.4 Frontend Testing
- [ ] Test upload flow end-to-end
- [ ] Test real-time status polling
- [ ] Test video download
- [ ] Test dashboard display
- [ ] Test responsive design
- [ ] Test error states

### 11.5 Integration Testing
- [ ] Full user flow: signup → upload → process → download
- [ ] Test with multiple concurrent jobs
- [ ] Test with edge case videos (very short, no audio, etc.)

---

## Phase 12: Deployment Preparation

### 12.1 Documentation
- [ ] Update README.md with setup instructions
- [ ] Document environment variables
- [ ] Document API endpoints
- [ ] Add troubleshooting guide

### 12.2 Deployment Configs
- [ ] Create `render.yaml` for Python agent service
- [ ] Create `render.yaml` for Node.js server
- [ ] Configure Vercel for Next.js frontend
- [ ] Set up UptimeRobot monitors

### 12.3 Security Checklist
- [ ] No API keys in code
- [ ] JWT secret is strong and secret
- [ ] CORS configured properly
- [ ] File upload limits enforced
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention in frontend

---

## Phase 13: Deployment

### 13.1 OpenRouter Setup
- [ ] Create OpenRouter account
- [ ] Get API key ($1 free credit)
- [ ] Test API key with sample request

### 13.2 Deploy Python Agent (Render.com)
- [ ] Create new Web Service
- [ ] Set root directory to `apps/processor/agent`
- [ ] Configure build command
- [ ] Configure start command
- [ ] Add all environment variables
- [ ] Deploy and verify health endpoint

### 13.3 Deploy Node.js Server (Render.com)
- [ ] Create new Web Service
- [ ] Set root directory to `apps/processor`
- [ ] Add FFmpeg to build command
- [ ] Configure start command
- [ ] Add all environment variables
- [ ] Deploy and verify health endpoint

### 13.4 Deploy Frontend (Vercel)
- [ ] Connect GitHub repository
- [ ] Set root directory to `apps/web`
- [ ] Add environment variables
- [ ] Deploy
- [ ] Verify production build

### 13.5 UptimeRobot Setup
- [ ] Create account
- [ ] Add monitor for Node.js server
- [ ] Add monitor for Python agent
- [ ] Set interval to 14 minutes

---

## Phase 14: Post-Deployment Verification

### 14.1 Production Testing
- [ ] Test complete user flow in production
- [ ] Verify cold start behavior
- [ ] Monitor OpenRouter usage
- [ ] Check video output quality
- [ ] Test download functionality

### 14.2 Monitoring Setup
- [ ] Monitor Render.com logs
- [ ] Monitor OpenRouter dashboard
- [ ] Track job success/failure rates
- [ ] Monitor disk usage

---

## Critical Implementation Notes

### ⚠️ MUST DO:
1. **Never exceed token budgets** - implement hard guards
2. **Use only free/cheap models** - never use banned models
3. **Clean up temp files** - prevent disk space issues
4. **Validate all inputs** - file size, duration, format
5. **Use FALLBACK_RENDER_SCRIPT** - don't retry on Director failure
6. **Delete raw files** - after successful processing
7. **Implement proper error handling** - at every step
8. **Test with OpenRouter** - before deploying

### 🚫 NEVER DO:
1. Don't use GPT-4o or other expensive models
2. Don't retry failed LLM calls (wastes tokens)
3. Don't send full-resolution frames to API
4. Don't exceed 30 frames per job
5. Don't hardcode API keys
6. Don't skip validation steps
7. Don't build post-MVP features yet

---

## Estimated Timeline

- **Phase 1-2:** 2-3 hours (Infrastructure + Auth)
- **Phase 3:** 2-3 hours (Job Management)
- **Phase 4:** 6-8 hours (Python Agent Pipeline) - MOST COMPLEX
- **Phase 5:** 3-4 hours (FFmpeg Rendering)
- **Phase 6-7:** 3-4 hours (Frontend Auth + Upload)
- **Phase 8-9:** 3-4 hours (Frontend Status + Dashboard)
- **Phase 10-11:** 4-5 hours (Error Handling + Testing)
- **Phase 12-14:** 3-4 hours (Deployment)

**Total: ~30-40 hours of focused development**

---

## Success Criteria

✅ User can sign up and log in
✅ User can upload a screen recording
✅ AI agent pipeline processes the video automatically
✅ Professional 3D-stylized video is generated
✅ User can download the processed video
✅ Dashboard shows all past jobs
✅ Cost per job stays under $0.01
✅ System works within free tier limits
✅ No manual intervention required

---

**Next Step:** Start with Phase 1 - verify and update the database schema and environment configuration.
