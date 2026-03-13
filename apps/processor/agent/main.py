import os
import asyncio
from pathlib import Path
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from parent directory
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

from pipeline.orchestrator import run_pipeline

app = FastAPI()

class AgentRequest(BaseModel):
    jobId: str
    inputPath: str

@app.post("/agent/run")
async def run_agent(request: AgentRequest, background_tasks: BackgroundTasks):
    """
    Accepts a job and starts the agent pipeline in the background.
    Returns immediately.
    """
    background_tasks.add_task(run_pipeline, request.jobId, request.inputPath)
    return {"accepted": True, "jobId": request.jobId}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
