# FocusCast AI — Full Agentic PRD
### Autonomous Screen Recording → 3D Professional Video Generator
**Version:** 2.0.0
**Author:** Muhammad Anas
**Target AI Builder:** Antigravity
**Last Updated:** March 2026
**Stack:** OpenAI Agents SDK + OpenRouter + FFmpeg + SQLite + Next.js
**Constraint:** Stay within free tier limits at all times

---

## ⚠️ CRITICAL INSTRUCTIONS FOR ANTIGRAVITY

Read every word of this document before writing a single line of code.

1. **Never hallucinate libraries.** Every package listed here is real and free.
2. **Never exceed token budgets** defined in Section 11. The system is designed around free tier limits.
3. **Never use GPT-4o for bulk tasks.** Use cheap models for analysis, expensive models only for final decisions.
4. **The agent pipeline runs on the backend only.** The frontend never touches OpenAI/OpenRouter directly.
5. **When in doubt — stop and re-read this document.** Do not guess.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Problem Being Solved](#2-problem-being-solved)
3. [User Personas](#3-user-personas)
4. [MVP Feature List](#4-mvp-feature-list)
5. [Post-MVP Features (DO NOT BUILD NOW)](#5-post-mvp-features-do-not-build-now)
6. [Tech Stack — 100% Free](#6-tech-stack--100-free)
7. [System Architecture](#7-system-architecture)
8. [Folder Structure](#8-folder-structure)
9. [Database Schema (SQLite)](#9-database-schema-sqlite)
10. [Agentic Pipeline — Full Design](#10-agentic-pipeline--full-design)
11. [Token Budget & Cost Management](#11-token-budget--cost-management)
12. [Agent Prompts (Exact Text)](#12-agent-prompts-exact-text)
13. [Tool Definitions (OpenAI Agents SDK)](#13-tool-definitions-openai-agents-sdk)
14. [Render Script JSON Schema](#14-render-script-json-schema)
15. [FFmpeg Rendering Engine](#15-ffmpeg-rendering-engine)
16. [API Endpoints](#16-api-endpoints)
17. [Frontend Pages & Components](#17-frontend-pages--components)
18. [Environment Variables](#18-environment-variables)
19. [Deployment Guide](#19-deployment-guide)
20. [Free Tier Limits & Hard Guardrails](#20-free-tier-limits--hard-guardrails)
21. [Error Handling Strategy](#21-error-handling-strategy)
22. [Full User Flow](#22-full-user-flow)
23. [Out of Scope](#23-out-of-scope)
24. [Final Checklist for Antigravity](#24-final-checklist-for-antigravity)

---

## 1. Product Vision

FocusCast AI is a web application that accepts a raw screen recording from a user and automatically produces a **professional, cinematic, 3D-stylized video** — without the user touching a single setting.

An AI agent pipeline watches the screen recording, understands what is happening (clicks, form fills, navigation, feature demos), and acts as an **autonomous video director** — deciding when to zoom in, when to pull back, where the focal point should be, and what visual style fits the content.

The output looks like a video made by a professional designer using Screen Studio or After Effects — but it is generated fully automatically in under 3 minutes.

**The core value proposition:**
> "Upload your screen recording. Get a professional product demo video. No editing. No design skills. Free."

---

## 2. Problem Being Solved

- Raw screen recordings look unprofessional on LinkedIn, GitHub, portfolios, and product demos
- Screen Studio costs $89 (macOS only) and requires manual work
- Loom, Descript, and Camtasia do not do 3D cinematic effects
- No free, AI-powered, cross-platform tool exists that auto-edits screen recordings into polished videos
- Developers and PMs upload demos constantly but lack the tools to make them look impressive

---

## 3. User Personas

### Primary — Developer / CS Student (Muhammad Anas)
- Builds AI agents, web apps, side projects
- Wants to showcase work on LinkedIn and GitHub
- Has zero budget, zero video editing experience
- Uses any OS (Windows/Mac/Linux)

### Secondary — Product Manager
- Records feature walkthroughs to share with stakeholders
- Needs polished output, no time for editing
- Values automation over control

### Tertiary — Designer / Freelancer
- Creates client demo videos
- Wants professional quality without After Effects

---

## 4. MVP Feature List

Build ONLY these features in v1.0. Nothing else.

| # | Feature | Notes |
|---|---------|-------|
| 1 | Upload screen recording (.mp4, .webm, .mov, max 100MB) | Multipart upload to server |
| 2 | Automatic AI analysis of the recording | Agent pipeline runs after upload |
| 3 | AI generates cinematic render script (keyframes, zoom, focus) | Director Agent output |
| 4 | FFmpeg renders the 3D-stylized output video | Based on render script |
| 5 | User can download the processed .mp4 | Served from /uploads/processed/ |
| 6 | Job status page with real-time polling | Shows agent progress steps |
| 7 | User auth (email + password, JWT) | SQLite users table |
| 8 | Dashboard of past jobs | Lists all jobs with status |
| 9 | Manual override panel (optional, post-processing) | User can re-render with tweaks |

---

## 5. Post-MVP Features (DO NOT BUILD NOW)

- Auto-generated captions/subtitles
- Multiple output aspect ratios (9:16, 1:1)
- Brand kit (custom colors, logos)
- Team workspaces
- Sharing via public link
- Audio enhancement / background music
- AI voiceover generation
- Mobile app

---

## 6. Tech Stack — 100% Free

### Frontend
| Tool | Version | Purpose | Free? |
|------|---------|---------|-------|
| Next.js | 14 (App Router) | Full-stack React framework | ✅ |
| Tailwind CSS | 3 | Styling | ✅ |
| shadcn/ui | latest | UI components | ✅ |
| React Player | latest | Video preview | ✅ |

### Agent Pipeline (Python)
| Tool | Version | Purpose | Free? |
|------|---------|---------|-------|
| openai-agents | latest | Agent orchestration SDK | ✅ |
| openai | latest | OpenAI Python client | ✅ |
| opencv-python | latest | Frame extraction from video | ✅ |
| Pillow | latest | Image resizing before API call | ✅ |
| httpx | latest | HTTP calls to OpenRouter | ✅ |
| pydantic | v2 | Structured output validation | ✅ |

### Backend / Rendering (Node.js)
| Tool | Version | Purpose | Free? |
|------|---------|---------|-------|
| Express | 4 | HTTP server | ✅ |
| fluent-ffmpeg | latest | FFmpeg wrapper | ✅ |
| FFmpeg | system binary | Video rendering | ✅ |
| multer | latest | File upload handling | ✅ |
| better-sqlite3 | latest | SQLite database | ✅ |
| bcryptjs | latest | Password hashing | ✅ |
| jsonwebtoken | latest | Auth tokens | ✅ |
| uuid | latest | Job ID generation | ✅ |
| cors | latest | Cross-origin requests | ✅ |
| axios | latest | Calls to Python agent server | ✅ |

### Infrastructure
| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Vercel | Next.js frontend | 100GB bandwidth/month |
| Render.com | Node.js + Python servers | 512MB RAM each, sleeps after 15min |
| OpenRouter | LLM API gateway | $1 free credit on signup |
| UptimeRobot | Keep Render.com awake | 50 monitors free |

---

## 7. System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                                │
│                    Next.js App (Vercel)                              │
│   /upload → /status/:jobId → /dashboard                             │
└─────────────────────────┬────────────────────────────────────────────┘
                          │ POST /api/jobs/create (multipart video)
                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│               NODE.JS SERVER — Render.com Service #1                 │
│                    (apps/server — port 3001)                         │
│                                                                      │
│  Routes:                                                             │
│  POST /api/auth/signup    → bcrypt → SQLite                          │
│  POST /api/auth/login     → JWT                                      │
│  POST /api/jobs/create    → multer → save file → create job          │
│  GET  /api/jobs/:id       → read SQLite job row                      │
│  GET  /api/jobs           → all jobs for user                        │
│  GET  /uploads/:path      → serve processed video                    │
│  GET  /health             → { status: ok }                           │
│                                                                      │
│  After saving file:                                                  │
│  → calls Python Agent Server: POST /agent/run                        │
│  → Node server DOES NOT wait (fire and forget)                       │
│                                                                      │
│  SQLite: focuscast.db                                                │
│  Files:  /uploads/raw/     /uploads/processed/                       │
└─────────────────────────┬────────────────────────────────────────────┘
                          │ POST /agent/run { jobId, inputPath }
                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│             PYTHON AGENT SERVER — Render.com Service #2              │
│                   (apps/agent — port 8000)                           │
│                                                                      │
│  FastAPI endpoint: POST /agent/run                                   │
│                                                                      │
│  ORCHESTRATOR AGENT (openai-agents SDK)                              │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │                                                             │     │
│  │  1. FRAME EXTRACTOR TOOL                                    │     │
│  │     → FFmpeg: extract 1 frame/sec as JPEG                   │     │
│  │     → Resize all frames to 512x288 (token budget)           │     │
│  │     → Returns: list of frame paths + timestamps             │     │
│  │                                                             │     │
│  │  2. ANALYST AGENT (cheap vision model via OpenRouter)       │     │
│  │     → Receives frames in batches of 10                      │     │
│  │     → Detects: clicks, typing, navigation, modals, scroll   │     │
│  │     → Returns: events JSON array                            │     │
│  │                                                             │     │
│  │  3. DIRECTOR AGENT (mid-tier model via OpenRouter)          │     │
│  │     → Receives full events JSON                             │     │
│  │     → Produces: render_script JSON (keyframes + style)      │     │
│  │     → Validates output against Pydantic schema              │     │
│  │                                                             │     │
│  │  4. RENDERER TOOL                                           │     │
│  │     → Calls Node.js /render/execute with render_script      │     │
│  │     → Node.js runs FFmpeg                                   │     │
│  │     → Returns: output video path                            │     │
│  │                                                             │     │
│  │  5. STATUS UPDATER TOOL                                     │     │
│  │     → Updates SQLite job row at each step                   │     │
│  │                                                             │     │
│  └─────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 8. Folder Structure

```
focuscast/
├── apps/
│   │
│   ├── web/                              ← Next.js (Vercel)
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                  ← Landing page
│   │   │   ├── upload/
│   │   │   │   └── page.tsx              ← Upload screen recording
│   │   │   ├── status/
│   │   │   │   └── [jobId]/page.tsx      ← Real-time job progress
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx              ← All past jobs
│   │   │   └── auth/
│   │   │       ├── login/page.tsx
│   │   │       └── signup/page.tsx
│   │   ├── components/
│   │   │   ├── VideoUploader.tsx         ← Drag-and-drop upload
│   │   │   ├── JobProgress.tsx           ← Agent step progress UI
│   │   │   ├── VideoPlayer.tsx           ← Before/after comparison
│   │   │   └── VideoCard.tsx             ← Dashboard card
│   │   ├── lib/
│   │   │   └── api.ts                    ← All fetch calls to Node server
│   │   └── types/index.ts
│   │
│   ├── server/                           ← Node.js Express (Render.com #1)
│   │   ├── index.js                      ← Server entry point
│   │   ├── db/
│   │   │   ├── init.js                   ← SQLite setup + schema
│   │   │   └── focuscast.db              ← Auto-created SQLite file
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── jobs.js
│   │   │   └── files.js                  ← Serve processed videos
│   │   ├── lib/
│   │   │   ├── auth.js                   ← JWT sign/verify
│   │   │   └── agentClient.js            ← Calls Python agent server
│   │   ├── uploads/
│   │   │   ├── raw/                      ← Input videos
│   │   │   └── processed/                ← Output videos
│   │   └── package.json
│   │
│   └── agent/                            ← Python FastAPI (Render.com #2)
│       ├── main.py                       ← FastAPI entry + /agent/run endpoint
│       ├── pipeline/
│       │   ├── orchestrator.py           ← OpenAI Agents SDK orchestrator
│       │   ├── analyst.py                ← Analyst Agent definition
│       │   ├── director.py               ← Director Agent definition
│       │   └── tools.py                  ← All tool functions
│       ├── lib/
│       │   ├── frames.py                 ← Frame extraction with OpenCV
│       │   ├── tokens.py                 ← Token counting + budget guard
│       │   ├── schema.py                 ← Pydantic models for render script
│       │   └── db.py                     ← SQLite job status updater
│       ├── requirements.txt
│       └── render.yaml                   ← Render.com config
│
└── README.md
```

---

## 9. Database Schema (SQLite)

### File: `apps/server/db/init.js`

```javascript
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'focuscast.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    email     TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id            TEXT PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status        TEXT NOT NULL DEFAULT 'pending',
    current_step  TEXT NOT NULL DEFAULT 'queued',
    input_path    TEXT NOT NULL,
    output_path   TEXT,
    error_message TEXT,
    render_script TEXT,
    token_used    INTEGER DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
```

### Job Status Values
```
'pending'    → job created, not yet sent to agent
'analyzing'  → Frame extraction + Analyst Agent running
'directing'  → Director Agent generating render script
'rendering'  → FFmpeg rendering in progress
'done'       → output video ready for download
'error'      → something failed (see error_message)
```

### current_step Values (shown in UI progress bar)
```
'queued'           → waiting to start
'extracting_frames' → FFmpeg pulling 1fps frames
'analyzing_video'  → AI watching frames
'generating_script' → Director writing keyframes
'rendering_video'  → FFmpeg applying effects
'complete'         → finished
```

---

## 10. Agentic Pipeline — Full Design

### Overview

The pipeline uses the **OpenAI Agents SDK** with **OpenRouter** as the LLM provider. It has one Orchestrator that coordinates two specialist Agents and three Tools.

```
Orchestrator Agent
│
├── Tool: extract_frames        → pure Python, no LLM
├── Agent: analyst_agent        → cheap vision model (google/gemini-flash-1.5)
├── Agent: director_agent       → mid-tier model (meta-llama/llama-3.1-8b-instruct)
├── Tool: render_video          → calls Node.js FFmpeg, no LLM
└── Tool: update_job_status     → writes to SQLite, no LLM
```

### Why This Model Selection (cost critical)

| Agent | Model | Why | Cost per 1M tokens |
|-------|-------|-----|-------------------|
| Analyst Agent | `google/gemini-flash-1.5` | Cheapest vision model on OpenRouter | ~$0.075 input |
| Director Agent | `meta-llama/llama-3.1-8b-instruct` | Free on OpenRouter, good at JSON | $0.00 (free tier) |
| Orchestrator | `meta-llama/llama-3.1-8b-instruct` | Routing only, minimal tokens | $0.00 (free tier) |

**Target cost per job: under $0.01 USD** (achievable with the token budgets in Section 11)

---

### File: `apps/agent/pipeline/orchestrator.py`

```python
from agents import Agent, Runner, handoff
from .analyst import analyst_agent
from .director import director_agent
from .tools import extract_frames, render_video, update_job_status

orchestrator = Agent(
    name="Orchestrator",
    model="openai/gpt-3.5-turbo",  # cheapest orchestration model
    instructions="""
You are a video production pipeline controller.
Your job is to coordinate specialist agents to transform a screen recording into a professional video.

Follow this EXACT sequence — do not skip steps, do not add steps:
1. Call extract_frames tool with the input_path
2. Hand off to analyst_agent with the extracted frame paths
3. Receive events JSON back from analyst_agent
4. Hand off to director_agent with the events JSON and video duration
5. Receive render_script JSON back from director_agent
6. Call render_video tool with the render_script
7. Call update_job_status tool with status='done' and output_path

If any step fails, call update_job_status with status='error' and the error message.
Do not attempt to fix errors yourself. Just report them accurately.
""",
    tools=[extract_frames, render_video, update_job_status],
    handoffs=[
        handoff(analyst_agent),
        handoff(director_agent),
    ]
)
```

---

### File: `apps/agent/pipeline/analyst.py`

```python
from agents import Agent

analyst_agent = Agent(
    name="AnalystAgent",
    model="google/gemini-flash-1.5",  # cheapest vision model
    instructions="""
You are a screen recording analyst. You receive a batch of video frames as images.

Your job is to identify meaningful UI events by looking at the frames carefully.

For each event you detect, output a JSON object with:
- "timestamp": number (seconds from video start, from the frame filename)
- "type": one of ["click", "type", "navigate", "scroll", "modal_open", "modal_close", "highlight"]
- "x": approximate x position as percentage of screen width (0-100)
- "y": approximate y position as percentage of screen height (0-100)  
- "description": one sentence describing what happened

STRICT RULES:
- Output ONLY a valid JSON array. No markdown. No explanation. No preamble.
- Maximum 20 events per batch. If more occur, pick the most visually significant ones.
- If nothing significant happens in a frame, skip it entirely.
- Timestamps come from frame filenames (e.g. frame_003.jpg = 3 seconds).

Example output:
[
  {"timestamp": 2.0, "type": "click", "x": 45, "y": 72, "description": "User clicked the Login button"},
  {"timestamp": 5.0, "type": "navigate", "x": 50, "y": 50, "description": "Page changed to dashboard"}
]
""",
    output_type=str  # raw JSON string, validated by Pydantic in tools.py
)
```

---

### File: `apps/agent/pipeline/director.py`

```python
from agents import Agent

director_agent = Agent(
    name="DirectorAgent",
    model="meta-llama/llama-3.1-8b-instruct",  # free on OpenRouter
    instructions="""
You are a professional video director. You receive a list of UI events from a screen recording.
Your job is to write a cinematic render script that will make this recording look like a professional product demo.

Rules for great cinematography:
- Start wide (zoom=1.0) for the first 2 seconds
- Zoom in (zoom 1.8-2.5) whenever a user clicks a specific element — focus on that element
- Pull back to zoom=1.0 between 1-2 seconds after a click
- Never jump straight from zoom 2.5 to zoom 1.0 — always ease out
- Apply a subtle 3D tilt (tiltX: 5-10 degrees) throughout for depth
- Choose background based on content: dark-gradient for dev tools, light-gradient for SaaS products
- Keyframe timestamps must be within the video duration
- Minimum 0.8 seconds between keyframes (no jarring cuts)

Output ONLY valid JSON matching this exact schema. No markdown. No explanation.

{
  "duration": <total video duration in seconds>,
  "background": "<dark-gradient|light-gradient|blur-gradient>",
  "baseStyle": {
    "tiltX": <number -10 to 10>,
    "tiltY": <number -5 to 5>,
    "borderRadius": <number 8 to 20>,
    "shadowIntensity": <number 0.3 to 0.8>
  },
  "keyframes": [
    {
      "time": <seconds>,
      "zoom": <1.0 to 3.0>,
      "focalX": <0 to 100>,
      "focalY": <0 to 100>,
      "easingIn": "<ease-in|ease-out|ease-in-out|linear>",
      "easingOut": "<ease-in|ease-out|ease-in-out|linear>",
      "reason": "<one sentence>"
    }
  ]
}
""",
    output_type=str  # raw JSON string, validated by Pydantic in schema.py
)
```

---

## 11. Token Budget & Cost Management

This is the most important section for keeping costs within free limits.

### OpenRouter Free Models (use these — they are $0.00)
```
meta-llama/llama-3.1-8b-instruct    → free, good JSON output
meta-llama/llama-3.2-3b-instruct    → free, faster
mistralai/mistral-7b-instruct       → free
```

### OpenRouter Paid-but-cheap Models (use only for vision)
```
google/gemini-flash-1.5  → $0.075/1M input tokens, $0.30/1M output
                           ~512x288 image = ~256 tokens
                           10 frames × 256 = 2,560 tokens = $0.0002 per batch
```

### Token Budget Per Job

| Step | Model | Max Input Tokens | Max Output Tokens | Max Cost |
|------|-------|-----------------|------------------|---------|
| Orchestrator routing | llama-3.1-8b | 500 | 200 | $0.00 |
| Analyst (per batch of 10 frames) | gemini-flash-1.5 | 3,500 | 800 | $0.0005 |
| Director | llama-3.1-8b | 2,000 | 1,000 | $0.00 |
| **Total per job** | | **~6,000** | **~2,000** | **~$0.001** |

With $1 free OpenRouter credit → **~1,000 free jobs**

### Hard Token Guards (implement in `apps/agent/lib/tokens.py`)

```python
# THESE ARE HARD LIMITS — never exceed them
MAX_FRAMES_PER_JOB = 30          # max frames sent to vision model
MAX_FRAMES_PER_BATCH = 10        # frames per single API call
FRAME_RESIZE_WIDTH = 512         # px — reduce tokens per image
FRAME_RESIZE_HEIGHT = 288        # px
MAX_EVENTS_FROM_ANALYST = 20     # cap events array length
MAX_KEYFRAMES_IN_SCRIPT = 15     # cap keyframes in render script
MAX_ANALYST_OUTPUT_TOKENS = 800  # hard cap on analyst response
MAX_DIRECTOR_INPUT_TOKENS = 2000 # trim events if too long
MAX_DIRECTOR_OUTPUT_TOKENS = 1000

def guard_token_budget(text: str, max_tokens: int) -> str:
    """
    Rough token estimator: 1 token ≈ 4 characters.
    Truncates text if it would exceed max_tokens.
    """
    max_chars = max_tokens * 4
    if len(text) > max_chars:
        return text[:max_chars]
    return text

def should_sample_frame(frame_index: int, total_frames: int) -> bool:
    """
    If video has more than MAX_FRAMES_PER_JOB frames,
    sample evenly across the video instead of using all frames.
    """
    if total_frames <= MAX_FRAMES_PER_JOB:
        return True
    step = total_frames / MAX_FRAMES_PER_JOB
    return frame_index % int(step) == 0
```

### Frame Extraction Strategy (critical for cost control)

```
Video duration  → Frames extracted  → API calls made
0–30 seconds    → 1 frame/sec → max 30 frames → 3 API calls (10 frames each)
30–60 seconds   → 1 frame/2sec → max 30 frames → 3 API calls
60–120 seconds  → 1 frame/4sec → max 30 frames → 3 API calls
120+ seconds    → 1 frame/Nsec → always max 30 frames → 3 API calls
```

---

## 12. Agent Prompts (Exact Text)

These are the complete, final prompts. Antigravity must use these exactly. Do not modify them.

### Orchestrator System Prompt
```
You are a video production pipeline controller for FocusCast AI.
Your ONLY job is to coordinate tools and agents in the correct sequence.
You do not analyze videos. You do not make creative decisions.
You execute steps and pass results between specialists.

Always follow this sequence:
1. extract_frames(input_path, job_id)
2. handoff to analyst_agent with frame_paths and job_id
3. handoff to director_agent with events_json, duration, job_id
4. render_video(render_script_json, job_id)
5. update_job_status(job_id, 'done', output_path)

On any error: update_job_status(job_id, 'error', error_message) then stop.
```

### Analyst Agent System Prompt
(See Section 10 — `analyst.py` instructions field)

### Director Agent System Prompt
(See Section 10 — `director.py` instructions field)

### Fallback Render Script (when Director Agent fails or returns invalid JSON)

If the Director Agent output fails Pydantic validation, use this safe default instead of retrying (saves tokens):

```python
FALLBACK_RENDER_SCRIPT = {
    "duration": None,  # fill from actual video duration
    "background": "dark-gradient",
    "baseStyle": {
        "tiltX": 8,
        "tiltY": 4,
        "borderRadius": 12,
        "shadowIntensity": 0.5
    },
    "keyframes": [
        {"time": 0.0, "zoom": 1.0, "focalX": 50, "focalY": 50,
         "easingIn": "ease-in", "easingOut": "ease-out", "reason": "Opening"},
        {"time": 2.0, "zoom": 1.3, "focalX": 50, "focalY": 40,
         "easingIn": "ease-in-out", "easingOut": "ease-in-out", "reason": "Gentle zoom"},
        {"time": None, "zoom": 1.0, "focalX": 50, "focalY": 50,
         "easingIn": "ease-out", "easingOut": "linear", "reason": "Fade out"}
        # Note: last keyframe time = duration - 1.0, set programmatically
    ]
}
```

---

## 13. Tool Definitions (OpenAI Agents SDK)

### File: `apps/agent/pipeline/tools.py`

```python
import subprocess, os, json, sqlite3
from agents import function_tool
from ..lib.frames import extract_video_frames
from ..lib.tokens import MAX_FRAMES_PER_JOB, should_sample_frame
from ..lib.schema import RenderScript
from ..lib.db import update_job_in_db
import httpx

DB_PATH = os.environ.get("DB_PATH", "/app/server/db/focuscast.db")
NODE_SERVER_URL = os.environ.get("NODE_SERVER_URL", "http://localhost:3001")

@function_tool
def extract_frames(input_path: str, job_id: str) -> str:
    """
    Extracts frames from the video at 1 frame per second (or less for long videos).
    Resizes frames to 512x288 to minimize token usage.
    Returns JSON: {"frame_paths": [...], "duration": float, "total_frames": int}
    """
    update_job_in_db(job_id, "analyzing", "extracting_frames")

    output_dir = f"/tmp/frames_{job_id}"
    os.makedirs(output_dir, exist_ok=True)

    frames, duration = extract_video_frames(input_path, output_dir, MAX_FRAMES_PER_JOB)

    return json.dumps({
        "frame_paths": frames,
        "duration": duration,
        "total_frames": len(frames),
        "job_id": job_id
    })


@function_tool
def render_video(render_script_json: str, job_id: str) -> str:
    """
    Sends the render script to the Node.js FFmpeg renderer.
    Returns JSON: {"output_path": str} on success or {"error": str} on failure.
    """
    update_job_in_db(job_id, "rendering", "rendering_video")

    try:
        response = httpx.post(
            f"{NODE_SERVER_URL}/render/execute",
            json={"renderScript": json.loads(render_script_json), "jobId": job_id},
            timeout=300.0  # 5 min timeout for FFmpeg
        )
        result = response.json()
        if response.status_code == 200:
            return json.dumps({"output_path": result["outputPath"]})
        else:
            return json.dumps({"error": result.get("error", "Render failed")})
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
def update_job_status(job_id: str, status: str, message: str) -> str:
    """
    Updates the job status in SQLite.
    status: 'analyzing' | 'directing' | 'rendering' | 'done' | 'error'
    message: output_path when done, error description when error
    """
    if status == "done":
        update_job_in_db(job_id, status, "complete", output_path=message)
    elif status == "error":
        update_job_in_db(job_id, status, "complete", error_message=message)
    else:
        update_job_in_db(job_id, status, message)

    return json.dumps({"updated": True, "job_id": job_id, "status": status})
```

---

## 14. Render Script JSON Schema

### File: `apps/agent/lib/schema.py`

```python
from pydantic import BaseModel, Field, validator
from typing import List, Literal

class Keyframe(BaseModel):
    time: float = Field(ge=0)
    zoom: float = Field(ge=1.0, le=3.0)
    focalX: float = Field(ge=0, le=100)
    focalY: float = Field(ge=0, le=100)
    easingIn: Literal["ease-in", "ease-out", "ease-in-out", "linear"]
    easingOut: Literal["ease-in", "ease-out", "ease-in-out", "linear"]
    reason: str

class BaseStyle(BaseModel):
    tiltX: float = Field(ge=-10, le=10)
    tiltY: float = Field(ge=-5, le=5)
    borderRadius: int = Field(ge=8, le=20)
    shadowIntensity: float = Field(ge=0.3, le=0.8)

class RenderScript(BaseModel):
    duration: float = Field(gt=0)
    background: Literal["dark-gradient", "light-gradient", "blur-gradient"]
    baseStyle: BaseStyle
    keyframes: List[Keyframe] = Field(min_items=2, max_items=15)

    @validator("keyframes")
    def keyframes_within_duration(cls, v, values):
        if "duration" in values:
            for kf in v:
                if kf.time > values["duration"]:
                    raise ValueError(f"Keyframe at {kf.time}s exceeds duration {values['duration']}s")
        return v

def parse_render_script(raw_json: str, video_duration: float) -> RenderScript:
    """
    Parses and validates the Director Agent's JSON output.
    Falls back to FALLBACK_RENDER_SCRIPT if invalid.
    """
    try:
        data = json.loads(raw_json)
        data["duration"] = video_duration  # always override with real duration
        return RenderScript(**data)
    except Exception as e:
        print(f"[schema] Director output invalid: {e}. Using fallback.")
        return build_fallback_script(video_duration)
```

---

## 15. FFmpeg Rendering Engine

### File: `apps/server/routes/render.js`

This is the Node.js route that receives the render script and runs FFmpeg.

```javascript
const router = require('express').Router();
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const db = require('../db/init');

router.post('/execute', async (req, res) => {
  const { renderScript, jobId } = req.body;

  if (!renderScript || !jobId) {
    return res.status(400).json({ error: 'Missing renderScript or jobId' });
  }

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const inputPath = job.input_path;
  const outputPath = path.join(__dirname, '../uploads/processed', `${jobId}.mp4`);

  // Respond immediately — FFmpeg runs async
  res.json({ accepted: true, jobId });

  try {
    await runFFmpeg(inputPath, outputPath, renderScript);

    db.prepare(`
      UPDATE jobs SET status='done', output_path=?, updated_at=datetime('now') WHERE id=?
    `).run(outputPath, jobId);

  } catch (err) {
    db.prepare(`
      UPDATE jobs SET status='error', error_message=?, updated_at=datetime('now') WHERE id=?
    `).run(err.message, jobId);
  } finally {
    // Clean up raw input file to save disk space
    try { require('fs').unlinkSync(inputPath); } catch (_) {}
  }
});

function runFFmpeg(inputPath, outputPath, script) {
  return new Promise((resolve, reject) => {
    const { background, baseStyle, keyframes, duration } = script;

    // Background color map
    const bgColors = {
      'dark-gradient':  '0x1a1a2e',
      'light-gradient': '0xf0f4f8',
      'blur-gradient':  '0x2d2d44'
    };
    const bgColor = bgColors[background] || bgColors['dark-gradient'];

    // Build perspective transform values from baseStyle
    // tiltX controls rotateY perspective offset
    // tiltY controls rotateX perspective offset
    const perspOffset = Math.round(baseStyle.tiltX * 3);

    // Build zoompan filter from keyframes
    // Use the FIRST keyframe zoom as base zoom for simplicity (MVP approach)
    // Post-MVP: implement full keyframe interpolation
    const baseZoom = keyframes[1]?.zoom || 1.3;
    const focalX = keyframes[1]?.focalX || 50;
    const focalY = keyframes[1]?.focalY || 40;

    // Convert focal percentages to pixel offsets
    // These are calculated relative to the scaled video size (1200x750)
    const scaledW = 1200;
    const scaledH = 750;
    const zoomPanX = `${scaledW}/2-(${scaledW}/zoom/2)+((${focalX}/100)*${scaledW}/zoom*0.3)`;
    const zoomPanY = `${scaledH}/2-(${scaledH}/zoom/2)+((${focalY}/100)*${scaledH}/zoom*0.3)`;

    ffmpeg(inputPath)
      .complexFilter([
        // 1. Create background canvas
        `color=c=${bgColor}:s=1920x1080[bg]`,
        // 2. Scale input video
        `[0:v]scale=${scaledW}:${scaledH}[scaled]`,
        // 3. Apply perspective (3D tilt simulation)
        `[scaled]perspective=x0=${perspOffset}:y0=20:x1=W-${perspOffset}:y1=20:x2=0:y2=H:x3=W:y3=H[persp]`,
        // 4. Apply zoom to focal point
        `[persp]zoompan=z='${baseZoom}':x='${zoomPanX}':y='${zoomPanY}':d=1:s=${scaledW}x${scaledH}:fps=30[zoomed]`,
        // 5. Add drop shadow (vignette approximation)
        `[zoomed]vignette=angle=PI/4:mode=backward[vignetted]`,
        // 6. Composite onto background
        `[bg][vignetted]overlay=(W-w)/2:(H-h)/2[out]`
      ])
      .outputOptions([
        '-map [out]',
        '-map 0:a?',          // copy audio if present, skip if not
        '-c:v libx264',
        '-preset fast',       // fast encode for free server
        '-crf 23',            // quality level (23 = good balance)
        '-c:a aac',
        '-movflags +faststart' // allows streaming before full download
      ])
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}

module.exports = router;
```

### Key FFmpeg Flags Explained

| Flag | What It Does |
|------|-------------|
| `perspective=x0:y0:x1:y1:x2:y2:x3:y3` | Distorts 4 corners to simulate 3D tilt |
| `zoompan=z='1.3'` | Zoom to 1.3x, pan to focal point |
| `vignette` | Darkens edges for cinematic depth feel |
| `color=c=0x1a1a2e:s=1920x1080` | Creates dark background canvas |
| `overlay=(W-w)/2:(H-h)/2` | Centers video on background |
| `-preset fast` | Faster FFmpeg encode (important on free 512MB server) |
| `-crf 23` | Quality: 0=lossless, 51=worst, 23=good balance |
| `-movflags +faststart` | Makes video playable while still downloading |

---

## 16. API Endpoints

### Node.js Server (`apps/server`)

#### Auth
```
POST /api/auth/signup    Body: {email, password}    → {token, user}
POST /api/auth/login     Body: {email, password}    → {token, user}
```

#### Jobs
```
POST /api/jobs/create    Auth required. Multipart: video file + settings JSON
                         → {jobId}

GET  /api/jobs/:id       Auth required.
                         → {id, status, currentStep, outputPath, errorMessage, createdAt}

GET  /api/jobs           Auth required.
                         → {jobs: [...]}
```

#### Render (internal — called by Python agent only)
```
POST /render/execute     No auth (internal network only)
                         Body: {renderScript, jobId}
                         → {accepted: true, jobId}
```

#### Files
```
GET  /uploads/processed/:jobId.mp4    Auth required. Streams video file.
GET  /health                          → {status: 'ok'}
```

### Python Agent Server (`apps/agent`)

```
POST /agent/run          No public auth (called by Node.js server only)
                         Body: {jobId, inputPath}
                         → {accepted: true}  (async — returns immediately)
```

---

## 17. Frontend Pages & Components

### Page: `/upload`

**Layout:** Two columns on desktop, single column on mobile.

**Left column:**
- Drag-and-drop zone (`react-dropzone`)
- Accepts: `.mp4`, `.webm`, `.mov`
- Max size: 100MB — show error if exceeded
- After upload: shows video filename + file size + green checkmark
- "Generate Professional Video" button — disabled until file uploaded

**Right column:**
- 3 example output cards showing before/after (use static demo images)
- Text: "AI analyzes your recording and creates a cinematic edit automatically"

**On submit:**
1. Upload file to `POST /api/jobs/create`
2. Redirect to `/status/{jobId}`

---

### Page: `/status/[jobId]`

This is the most important page. Shows real-time agent progress.

**Progress Steps UI:**
```
[✓] Upload received
[✓] Extracting frames
[⟳] AI analyzing video...       ← spinning when active
[ ] Generating render script
[ ] Rendering video
[ ] Complete
```

Each step maps to `current_step` value from the DB.

**Polling:** Call `GET /api/jobs/:id` every **3 seconds**. Stop when `status === 'done'` or `status === 'error'`.

**When done:**
- Show before/after video comparison side by side
- Large "Download Video" button
- "Start New Project" button

**When error:**
- Show friendly error message
- "Try Again" button

---

### Page: `/dashboard`

- Grid of VideoCard components
- Each card shows: thumbnail (first frame), status badge, date, download button
- Filter by status (all / done / processing)

---

## 18. Environment Variables

### `apps/web/.env.local`
```env
NEXT_PUBLIC_SERVER_URL=https://focuscast-server.onrender.com
```

### `apps/server/.env` (set in Render.com dashboard)
```env
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
AGENT_SERVER_URL=https://focuscast-agent.onrender.com
PORT=3001
NODE_ENV=production
```

### `apps/agent/.env` (set in Render.com dashboard)
```env
OPENROUTER_API_KEY=<your OpenRouter API key>
NODE_SERVER_URL=https://focuscast-server.onrender.com
DB_PATH=/app/server/db/focuscast.db
PORT=8000

# OpenRouter base URL — this is how you use OpenRouter with OpenAI SDK
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=<same as OPENROUTER_API_KEY>
```

### How to Configure OpenAI Agents SDK to Use OpenRouter

```python
# apps/agent/pipeline/orchestrator.py — top of file
import os
from openai import AsyncOpenAI

# This is the critical config that makes OpenAI Agents SDK use OpenRouter
openrouter_client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"],
    default_headers={
        "HTTP-Referer": "https://focuscast.vercel.app",  # required by OpenRouter
        "X-Title": "FocusCast AI"                         # shown in OpenRouter dashboard
    }
)

# Pass this client to your agents
# The openai-agents SDK accepts a custom client via model config
```

---

## 19. Deployment Guide

### Step 1: Get Free OpenRouter API Key
1. Go to https://openrouter.ai → Sign up
2. Go to Keys → Create new key
3. You get $1 free credit (enough for ~1,000 jobs at $0.001/job)
4. Copy the key — it starts with `sk-or-`

### Step 2: Deploy Python Agent to Render.com
1. Render.com → New → Web Service
2. Root directory: `apps/agent`
3. Runtime: Python 3
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
6. Add all env vars from `apps/agent/.env`
7. Note your URL: `https://focuscast-agent.onrender.com`

### Step 3: Deploy Node.js Server to Render.com
1. Render.com → New → Web Service
2. Root directory: `apps/server`
3. Runtime: Node
4. Build command: `apt-get update && apt-get install -y ffmpeg && npm install`
5. Start command: `node index.js`
6. Add all env vars from `apps/server/.env`
7. Note your URL: `https://focuscast-server.onrender.com`

### Step 4: Deploy Frontend to Vercel
1. Vercel → New Project → Import GitHub repo
2. Root directory: `apps/web`
3. Add `NEXT_PUBLIC_SERVER_URL`
4. Deploy

### Step 5: Set Up UptimeRobot (prevent Render.com sleeping)
1. https://uptimerobot.com → Free account
2. Monitor 1: `https://focuscast-server.onrender.com/health` — every 14 min
3. Monitor 2: `https://focuscast-agent.onrender.com/health` — every 14 min

### `apps/agent/requirements.txt`
```
fastapi==0.110.0
uvicorn==0.29.0
openai-agents>=0.1.0
openai>=1.0.0
opencv-python-headless==4.9.0.80
Pillow==10.3.0
pydantic==2.7.0
httpx==0.27.0
python-multipart==0.0.9
```

---

## 20. Free Tier Limits & Hard Guardrails

### OpenRouter Free Budget
```
Starting credit:    $1.00
Cost per job:       ~$0.001
Total free jobs:    ~1,000
```

### Enforce These Hard Limits in Code (never bypass them)

```python
# apps/agent/lib/tokens.py

# Video input limits
MAX_VIDEO_SIZE_MB = 100
MAX_VIDEO_DURATION_SECONDS = 120  # refuse videos longer than 2 min

# Frame sampling limits
MAX_FRAMES_SENT_TO_API = 30
FRAME_WIDTH = 512
FRAME_HEIGHT = 288

# LLM output limits
MAX_ANALYST_EVENTS = 20
MAX_DIRECTOR_KEYFRAMES = 15
MAX_ANALYST_OUTPUT_TOKENS = 800
MAX_DIRECTOR_OUTPUT_TOKENS = 1000

# Never use these models (too expensive):
BANNED_MODELS = [
    "openai/gpt-4o",
    "anthropic/claude-3-5-sonnet",
    "google/gemini-pro-1.5",
]
```

### Render.com Free Tier Behavior
- Server sleeps after 15 minutes of no traffic
- Cold start takes ~30 seconds
- Show a loading message on the frontend: *"Server is waking up, this may take 30 seconds on first use..."*
- Filesystem is ephemeral (resets on redeploy) — SQLite DB resets too. Acceptable for MVP.

---

## 21. Error Handling Strategy

### Frontend Error Messages
| Error | Message Shown to User |
|-------|-----------------------|
| File > 100MB | "Please upload a video under 100MB" |
| Video > 2 minutes | "Please upload a video under 2 minutes for the free tier" |
| Wrong file type | "Only .mp4, .webm, and .mov files are supported" |
| Server cold start | "Server is waking up... please wait 30 seconds" |
| AI analysis failed | "We couldn't analyze your video. Rendering with a default cinematic style." |
| FFmpeg failed | "Rendering failed. Please try a different video file." |
| OpenRouter quota hit | "Free quota reached for today. Please try again tomorrow." |

### Backend Error Handling Rules
1. If Analyst Agent returns invalid JSON → skip events, use empty array, continue to Director
2. If Director Agent returns invalid JSON → use FALLBACK_RENDER_SCRIPT, continue to FFmpeg
3. If FFmpeg fails → set job `status: error`, log stderr, do not retry
4. If OpenRouter returns 429 (rate limit) → set job `status: error`, message: "quota_exceeded"
5. Always clean up frame files in `/tmp/frames_{jobId}/` after agent run, success or failure
6. Always delete `/uploads/raw/{jobId}.*` after FFmpeg run, success or failure

---

## 22. Full User Flow

```
1.  User visits focuscast.vercel.app
2.  Clicks "Get Started Free"
3.  Signs up: email + password
    → POST /api/auth/signup → bcrypt hash → SQLite insert → JWT returned
    → JWT stored in localStorage
4.  Redirected to /upload
5.  Drags and drops screen recording (.mp4, max 100MB, max 2 min)
6.  Clicks "Generate Professional Video"
    → POST /api/jobs/create (multipart: video file + empty settings)
    → Server saves file to /uploads/raw/{jobId}.mp4
    → Job row inserted in SQLite: status='pending'
    → Server calls Python agent: POST /agent/run {jobId, inputPath}
    → Server returns {jobId} immediately
7.  Browser redirected to /status/{jobId}
8.  Frontend polls GET /api/jobs/{jobId} every 3 seconds
    → Shows step-by-step progress:
       ✓ Upload received
       ⟳ Extracting frames (FFmpeg, ~5s)
       ⟳ AI analyzing video (Analyst Agent, ~20s)
       ⟳ Generating render script (Director Agent, ~10s)
       ⟳ Rendering video (FFmpeg, ~30-60s)
9.  Agent pipeline runs:
    a. Orchestrator starts
    b. extract_frames tool: 1fps frames extracted, resized to 512x288
    c. Analyst Agent: frames sent in batches of 10 to gemini-flash-1.5
       → returns events JSON
    d. Director Agent: events sent to llama-3.1-8b
       → returns render_script JSON
    e. Pydantic validates render_script
    f. render_video tool: calls Node.js /render/execute
    g. FFmpeg runs, outputs /uploads/processed/{jobId}.mp4
    h. update_job_status: status='done', output_path set
10. Frontend sees status='done'
    → Shows before/after comparison
    → Shows "Download Video" button
11. User clicks download
    → GET /uploads/processed/{jobId}.mp4
    → Browser downloads the file
12. User goes to /dashboard to see all projects
```

---

## 23. Out of Scope

Do NOT build any of these. Do not add placeholders. Do not scaffold.

- ❌ Real-time video editing (this is async batch processing)
- ❌ Mobile app
- ❌ Audio editing or music generation
- ❌ AI voiceover
- ❌ Social media publishing
- ❌ Team collaboration
- ❌ Stripe payments
- ❌ Custom brand kit
- ❌ GPU-based rendering (Remotion Lambda etc.)
- ❌ Any model from BANNED_MODELS list
- ❌ Cursor tracking via OS hooks (AI vision only)
- ❌ Subtitle/caption generation

---

## 24. Final Checklist for Antigravity

Before marking this project complete, verify every single item:

**Auth**
- [ ] User can sign up with email + password
- [ ] Password stored as bcrypt hash, never plaintext
- [ ] JWT returned on login, stored in localStorage on frontend
- [ ] All `/api/jobs/*` routes require valid JWT

**Upload**
- [ ] Video file saved to `/uploads/raw/{jobId}.mp4`
- [ ] Files over 100MB rejected with clear error
- [ ] Videos over 2 minutes rejected with clear error
- [ ] Job row created in SQLite immediately after upload

**Agent Pipeline**
- [ ] Python agent server starts with `uvicorn`
- [ ] OpenAI Agents SDK configured to use OpenRouter base URL
- [ ] `HTTP-Referer` and `X-Title` headers sent on every OpenRouter call
- [ ] Free models used for Orchestrator and Director (llama-3.1-8b)
- [ ] Cheap vision model used for Analyst (gemini-flash-1.5)
- [ ] No model from BANNED_MODELS list ever called
- [ ] Frames resized to 512x288 before sending to API
- [ ] Max 30 frames sent per job
- [ ] Max 10 frames per API batch call
- [ ] Pydantic validates Director output before passing to FFmpeg
- [ ] FALLBACK_RENDER_SCRIPT used if Director output is invalid
- [ ] Frame temp files deleted after each job
- [ ] Raw input video deleted after FFmpeg completes

**Rendering**
- [ ] FFmpeg installed on Render.com via build command
- [ ] Perspective transform applied based on baseStyle.tiltX/tiltY
- [ ] Zoom applied to focal point from first action keyframe
- [ ] Background color matches selected background preset
- [ ] Output is 1920x1080 .mp4 with H.264 codec
- [ ] `-movflags +faststart` included for streaming

**Frontend**
- [ ] Progress steps update in real time (polling every 3s)
- [ ] Before/after video comparison shown when done
- [ ] Download button works and triggers file download
- [ ] Cold start message shown if server responds slowly
- [ ] Error states handled gracefully with user-friendly messages

**Infrastructure**
- [ ] UptimeRobot pinging both Render.com services every 14 minutes
- [ ] `OPENROUTER_API_KEY` set in Render.com env (never hardcoded)
- [ ] `JWT_SECRET` set in Render.com env (never hardcoded)
- [ ] CORS configured to allow Vercel frontend domain only

---

*End of PRD — FocusCast AI v2.0*
*Stack: Next.js + OpenAI Agents SDK + OpenRouter + FFmpeg + SQLite*
*Target cost per job: ~$0.001 | Free jobs with $1 OpenRouter credit: ~1,000*
*Built for Muhammad Anas | 100% Free Infrastructure*