import os
import json
import httpx
from agents import function_tool
from lib.frames import extract_video_frames
from lib.tokens import MAX_FRAMES_PER_JOB
from lib.db import update_job_in_db

NODE_SERVER_URL = os.environ.get("NODE_SERVER_URL", "http://localhost:4001")

def extract_frames_impl(input_path: str, job_id: str) -> str:
    print(f"[Tools] Extracting frames for job {job_id} from {input_path}")
    update_job_in_db(job_id, "analyzing", "extracting_frames")
    
    # Use workspace-relative temp directory for better Windows compatibility
    base_temp = os.path.join(os.path.dirname(os.path.dirname(__file__)), "temp")
    output_dir = os.path.join(base_temp, f"frames_{job_id}")
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"[Tools] Output directory: {output_dir}")
    frames, duration = extract_video_frames(input_path, output_dir, MAX_FRAMES_PER_JOB)
    return json.dumps({
        "frame_paths": frames,
        "duration": duration,
        "total_frames": len(frames),
        "job_id": job_id
    })

@function_tool
def extract_frames_tool(input_path: str, job_id: str) -> str:
    """Extracts frames from video. Returns JSON with paths."""
    return extract_frames_impl(input_path, job_id)

def render_video_impl(render_script_json: str, job_id: str) -> str:
    update_job_in_db(job_id, "rendering", "rendering_video")
    try:
        response = httpx.post(
            f"{NODE_SERVER_URL}/render/execute",
            json={"renderScript": json.loads(render_script_json), "jobId": job_id},
            timeout=300.0
        )
        result = response.json()
        if response.status_code == 200:
            return json.dumps({"output_path": result.get("outputPath", "")})
        else:
            return json.dumps({"error": result.get("error", "Render failed")})
    except Exception as e:
        return json.dumps({"error": str(e)})

@function_tool
def render_video_tool(render_script_json: str, job_id: str) -> str:
    """Sends render script to Node.js backend."""
    return render_video_impl(render_script_json, job_id)

def update_job_status_impl(job_id: str, status: str, message: str) -> str:
    if status == "done":
        update_job_in_db(job_id, status, "complete")
    elif status == "error":
        update_job_in_db(job_id, status, "complete", error_message=message)
    else:
        update_job_in_db(job_id, status, message)
    return json.dumps({"updated": True, "job_id": job_id, "status": status})

@function_tool
def update_job_status_tool(job_id: str, status: str, message: str) -> str:
    """Updates job status in SQLite."""
    return update_job_status_impl(job_id, status, message)
