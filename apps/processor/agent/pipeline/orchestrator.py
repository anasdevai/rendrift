import os
import json
import asyncio
from openai import AsyncOpenAI
import agents
from agents import Agent, Runner, handoff, ModelSettings
from agents.models.openai_chatcompletions import OpenAIChatCompletionsModel
from lib.schema import parse_render_script, build_fallback_script
from lib.db import update_job_in_db
from lib.tokens import (
    MAX_ANALYST_OUTPUT_TOKENS, 
    MAX_DIRECTOR_OUTPUT_TOKENS,
    MAX_ANALYST_OUTPUT_TOKENS as MAX_ORCHESTRATOR_OUTPUT_TOKENS
)
from pipeline.tools import (
    extract_frames_impl,
    render_video_impl,
    update_job_status_impl
)

# Specialist Agents Definitions

def get_model(model_name: str, client: AsyncOpenAI):
    return OpenAIChatCompletionsModel(model_name, client)

async def run_pipeline(job_id: str, input_path: str):
    try:
        print(f"[Pipeline] Starting for job {job_id}")
        
        # Disable internal SDK tracing to avoid 401 errors with OpenRouter keys
        try:
            import agents.tracing
            agents.tracing.set_tracing_disabled(True)
        except:
            pass
            
        api_key = os.environ.get("OPENROUTER_API_KEY")
        
        # Stop SDK from automatically trying to use the key for tracing
        if "OPENAI_API_KEY" in os.environ:
            del os.environ["OPENAI_API_KEY"]
            
        client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
            default_headers={
                "HTTP-Referer": "https://focuscast.run",
                "X-Title": "FocusCast AI"
            }
        )
        agents.set_default_openai_client(client)
        
        # Use simpler model names and let SDK handle it with forced base_url
        analyst_model = os.environ.get("ANALYST_MODEL", "openrouter/free")
        director_model = os.environ.get("DIRECTOR_MODEL", "openrouter/free")
        
        # Specialist Agents with optimized token settings
        analyst = Agent(
            name="AnalystAgent",
            model=OpenAIChatCompletionsModel(analyst_model, client),
            instructions="""Act as a Professional Motion Analyst.
Your goal is to pinpoint high-value interaction centers for cinematic tracking.
For each notable event or mouse movement sequence, identify:
1. 'time': precise timestamp in seconds.
2. 'type': (click, type, navigate, hover, scroll).
3. 'detail': What is happening (e.g., 'User clicks Submit button').
4. 'x', 'y': Precise center coordinate (0-100) of the interaction.

CRITICAL: If an action involves movement (like a drag or a long scroll), provide multiple points across the duration to allow for a 'Tracking Shot'.
Output a JSON list of these events. Accuracy is paramount for high-end rendering."""
        )
        
        director = Agent(
            name="DirectorAgent",
            model=OpenAIChatCompletionsModel(director_model, client),
            instructions="""Act as a Virtual Cinematographer.
Create a high-end 3D render script focusing on 'Professional Tracking'.
You must output a JSON object with exactly these TOP-LEVEL keys: "background", "baseStyle", "keyframes".
- "background": "dark-gradient"
- "baseStyle": {"tiltX": 8, "tiltY": 4, "borderRadius": 12, "shadowIntensity": 0.5}
- "keyframes": A list (max 30) with: "time", "zoom", "focalX", "focalY", "easingIn", "easingOut", "reason".
  - EXACT EASING VALUES: You MUST only use "ease-in", "ease-out", "ease-in-out", or "linear". NEVER use "easeOutCubic" or others.

Cinematography Rules:
- MOMENTUM: Sweep smoothly towards points. Use at least 2 points for movement tracking.
- PRE-EMPT: Start moving 0.5s before an action.
- ZOOM: 1.0 (base), 1.5-1.8 (standard), 2.3+ (intense).
- FINALE: Always end at time=duration with zoom=1.0, focalX=50, focalY=50.
Output ONLY the raw JSON."""
        )
        
        print(f"[Pipeline] Running python orchestration for job {job_id}")
        print(f"[Pipeline] Client base URL: {client.base_url}")
        print(f"[Pipeline] Models: Analyst={analyst_model}, Director={director_model}")

        # Step 1: Extract Frames
        print("[Pipeline] Step 1: Extracting Frames")
        frames_res = json.loads(extract_frames_impl(input_path, job_id))
        if "error" in frames_res:
            raise Exception(frames_res["error"])
        
        # Step 2: Analyst Agent
        print("[Pipeline] Step 2: Analyst Agent")
        update_job_status_impl(job_id, "analyzing_video", "Running AI vision analysis on frames.")
        analyst_msg = f"Analyze these frames and return JSON events: {json.dumps(frames_res['frame_paths'])}"
        analyst_result = await Runner.run(analyst, analyst_msg)
        
        # Parse analyst text to string if it's an object or list
        events_text = analyst_result.final_output
        if not isinstance(events_text, str):
            events_text = json.dumps(events_text)

        # Step 3: Director Agent
        print("[Pipeline] Step 3: Director Agent")
        update_job_status_impl(job_id, "generating_script", "Generating cinematic render script.")
        director_msg = f"Convert these events to 3D render script JSON. Events: {events_text}"
        director_result = await Runner.run(director, director_msg)
        
        script_text = director_result.final_output
        if not isinstance(script_text, str):
            script_text = json.dumps(script_text)

        # Step 4: Final Render
        print("[Pipeline] Step 4: Render Video")
        # Try to parse script json out of markdown wrapper if model added it
        raw_script_text = script_text
        if "```json" in script_text:
            script_text = script_text.split("```json")[-1].split("```")[0].strip()
        elif "```" in script_text:
            script_text = script_text.split("```")[-1].split("```")[0].strip()

        from lib.schema import parse_render_script
        
        # Enforce valid schema, falling back automatically if the shape is wrong
        try:
            duration = frames_res.get("duration", 10.0)
            # Pre-parse to clamp times if AI overshot duration
            try:
                temp_data = json.loads(script_text)
                if "keyframes" in temp_data:
                    for kf in temp_data["keyframes"]:
                        kf["time"] = min(float(kf["time"]), duration)
                script_text = json.dumps(temp_data)
            except:
                pass

            render_script_obj = parse_render_script(script_text, duration)
            script_text = render_script_obj.model_dump_json()
        except Exception as schema_err:
            print(f"[Pipeline] Schema validation failed: {schema_err}")
            print(f"[Pipeline] Raw Director output: {script_text}")
            from lib.schema import build_fallback_script
            render_script_obj = build_fallback_script(video_duration=frames_res.get("duration", 10.0))
            script_text = render_script_obj.model_dump_json()

        render_res = json.loads(render_video_impl(script_text, job_id))
        if "error" in render_res:
            raise Exception(render_res["error"])
        
        # Step 5: Done
        print(f"[Pipeline] Orchestrator run complete for job {job_id}")
        update_job_status_impl(job_id, "done", "complete")
        
    except Exception as e:
        import traceback
        print(f"[Pipeline] Error for job {job_id}: {e}")
        traceback.print_exc()
        update_job_status_impl(job_id, "error", f"Error code: 400 - {e}")
    finally:
        import shutil
        import os as temp_os
        base_temp = temp_os.path.join(temp_os.path.dirname(temp_os.path.dirname(__file__)), "temp")
        output_dir = temp_os.path.join(base_temp, f"frames_{job_id}")
        shutil.rmtree(output_dir, ignore_errors=True)
