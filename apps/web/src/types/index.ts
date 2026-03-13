export interface Keyframe {
    time: number;
    zoom: number;
    focalX: number;
    focalY: number;
    easingIn: string;
    easingOut: string;
    reason: string;
}

// Support older components using 'timestamp'
export interface UIKeyframe extends Omit<Keyframe, 'time'> {
    timestamp: number;
}

export interface BaseStyle {
    tiltX: number;
    tiltY: number;
    borderRadius: number;
    shadowIntensity: number;
}

export type VideoBackground = 'dark-gradient' | 'light-gradient' | 'blur-gradient' | 'device-mockup';

export interface RenderScript {
    duration: number;
    background: VideoBackground;
    baseStyle: BaseStyle;
    keyframes: Keyframe[];
}

// Alias for older components
export type VideoSettings = RenderScript;

export type JobStatus = 'pending' | 'analyzing' | 'directing' | 'rendering' | 'done' | 'error';

export type JobStep = 'queued' | 'extracting_frames' | 'analyzing_video' | 'generating_script' | 'rendering_video' | 'complete';

export interface Job {
    id: string;
    status: JobStatus;
    currentStep: JobStep;
    outputPath?: string;
    errorMessage?: string;
    renderScript?: RenderScript;
    tokenUsed?: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    email: string;
}
