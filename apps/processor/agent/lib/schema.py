import json
from pydantic import BaseModel, Field, field_validator
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
    keyframes: List[Keyframe] = Field(min_length=2, max_length=30)

    @field_validator("keyframes")
    @classmethod
    def keyframes_within_duration(cls, v, info):
        if "duration" in info.data:
            for kf in v:
                if kf.time > info.data["duration"]:
                    raise ValueError(f"Keyframe at {kf.time}s exceeds duration {info.data['duration']}s")
        return v

def build_fallback_script(video_duration: float) -> RenderScript:
    """
    Returns a safe default render script when Director Agent fails.
    """
    return RenderScript(
        duration=video_duration,
        background="dark-gradient",
        baseStyle=BaseStyle(
            tiltX=8,
            tiltY=4,
            borderRadius=12,
            shadowIntensity=0.5
        ),
        keyframes=[
            Keyframe(
                time=0.0,
                zoom=1.0,
                focalX=50,
                focalY=50,
                easingIn="ease-in",
                easingOut="ease-out",
                reason="Opening"
            ),
            Keyframe(
                time=2.0,
                zoom=1.3,
                focalX=50,
                focalY=40,
                easingIn="ease-in-out",
                easingOut="ease-in-out",
                reason="Gentle zoom"
            ),
            Keyframe(
                time=max(video_duration - 1.0, 3.0),
                zoom=1.0,
                focalX=50,
                focalY=50,
                easingIn="ease-out",
                easingOut="linear",
                reason="Fade out"
            )
        ]
    )

def parse_render_script(raw_json: str, video_duration: float) -> RenderScript:
    """
    Parses and validates the Director Agent's JSON output.
    Falls back to build_fallback_script if invalid.
    """
    try:
        data = json.loads(raw_json)
        data["duration"] = video_duration  # always override with real duration
        return RenderScript(**data)
    except Exception as e:
        print(f"[schema] Director output invalid: {e}. Using fallback.")
        return build_fallback_script(video_duration)
