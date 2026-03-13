import cv2
import os
from PIL import Image
from .tokens import MAX_FRAMES_PER_JOB, FRAME_RESIZE_WIDTH, FRAME_RESIZE_HEIGHT, should_sample_frame

def extract_video_frames(input_path: str, output_dir: str, max_frames: int = MAX_FRAMES_PER_JOB):
    """
    Extracts frames from video at 1 frame per second (or less for long videos).
    Resizes frames to reduce token usage.
    Returns: (list of frame paths, video duration in seconds)
    """
    os.makedirs(output_dir, exist_ok=True)
    
    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps if fps > 0 else 0
    
    frame_paths = []
    frame_count = 0
    saved_count = 0
    
    # Calculate frame interval (extract 1 frame per second, or less for long videos)
    frame_interval = max(1, int(fps))  # 1 frame per second
    print(f"[Frames] FPS: {fps}, Total: {total_frames}, Interval: {frame_interval}")
    
    while cap.isOpened() and saved_count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Only process frames at the interval
        if frame_count % frame_interval == 0:
            if should_sample_frame(saved_count, min(total_frames // frame_interval, max_frames)):
                # Convert BGR to RGB
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Convert to PIL Image for resizing
                pil_image = Image.fromarray(frame_rgb)
                pil_image = pil_image.resize((FRAME_RESIZE_WIDTH, FRAME_RESIZE_HEIGHT), Image.LANCZOS)
                
                # Save frame
                frame_filename = f"frame_{saved_count:03d}.jpg"
                frame_path = os.path.join(output_dir, frame_filename)
                pil_image.save(frame_path, "JPEG", quality=85)
                
                frame_paths.append(frame_path)
                saved_count += 1
        
        frame_count += 1
    
    cap.release()
    
    return frame_paths, duration
