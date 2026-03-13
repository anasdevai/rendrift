# Token budget constants - NEVER exceed these
MAX_FRAMES_PER_JOB = 30
MAX_FRAMES_PER_BATCH = 10
FRAME_RESIZE_WIDTH = 512
FRAME_RESIZE_HEIGHT = 288
MAX_EVENTS_FROM_ANALYST = 20
MAX_KEYFRAMES_IN_SCRIPT = 15
MAX_ANALYST_OUTPUT_TOKENS = 800
MAX_DIRECTOR_INPUT_TOKENS = 2000
MAX_DIRECTOR_OUTPUT_TOKENS = 1000

# Banned models - too expensive
BANNED_MODELS = [
    "openai/gpt-4o",
    "anthropic/claude-3-5-sonnet",
    "google/gemini-pro-1.5",
]

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
