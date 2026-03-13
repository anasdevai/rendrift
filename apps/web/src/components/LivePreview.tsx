'use client';

import React from 'react';
import { Keyframe, RenderScript } from '@/types';
import { clsx } from 'clsx';

interface LivePreviewProps {
    file: File | null;
    settings: RenderScript;
}

export const LivePreview: React.FC<LivePreviewProps & {
    onFocusChange?: (x: number, y: number) => void,
    onTimeUpdate?: (time: number) => void,
    currentTime?: number,
    isPlaying?: boolean
}> = ({ file, settings, onFocusChange, onTimeUpdate, currentTime = 0, isPlaying = false }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [url, setUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(e => console.warn('Play failed:', e));
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    React.useEffect(() => {
        if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
            videoRef.current.currentTime = currentTime;
        }
    }, [currentTime]);

    React.useEffect(() => {
        if (file) {
            const u = URL.createObjectURL(file);
            setUrl(u);
            return () => URL.revokeObjectURL(u);
        }
    }, [file]);

    // Interpolation logic (matching Remotion's professional easing)
    const currentSettings = React.useMemo(() => {
        const kfs = [...settings.keyframes].sort((a, b) => a.time - b.time);

        if (kfs.length === 0) return { tiltX: 0, tiltY: 0, zoom: 1, focalX: 50, focalY: 50 };
        if (currentTime <= kfs[0].time) return { ...kfs[0], tiltX: settings.baseStyle.tiltX, tiltY: settings.baseStyle.tiltY };
        if (currentTime >= kfs[kfs.length - 1].time) return { ...kfs[kfs.length - 1], tiltX: settings.baseStyle.tiltX, tiltY: settings.baseStyle.tiltY };

        const nextIndex = kfs.findIndex(kf => kf.time > currentTime);
        const prev = kfs[nextIndex - 1];
        const next = kfs[nextIndex];

        const ratio = (currentTime - prev.time) / (next.time - prev.time);
        
        // Professional Ease Out Cubic
        const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
        const t = easeOutCubic(ratio);

        return {
            tiltX: settings.baseStyle.tiltX, // Fixed base tilt for now or can interpolate if needed
            tiltY: settings.baseStyle.tiltY,
            zoom: prev.zoom + (next.zoom - prev.zoom) * t,
            focalX: prev.focalX + (next.focalX - prev.focalX) * t,
            focalY: prev.focalY + (next.focalY - prev.focalY) * t,
        };
    }, [settings.keyframes, settings.baseStyle, currentTime]);

    const handleContainerClick = (e: React.MouseEvent) => {
        if (!containerRef.current || !onFocusChange) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        onFocusChange(Math.round(x), Math.round(y));
    };

    const bgColor = settings.background === 'light-gradient' ? 'bg-zinc-100' : 'bg-[#050506]';
    const accentColor = settings.background === 'light-gradient' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.15)';

    return (
        <div
            className={clsx(
                "relative aspect-video rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-500 border border-zinc-800/50 cursor-crosshair group",
                bgColor
            )}
            onClick={handleContainerClick}
        >
            {/* Background Glow - Dynamic following focus */}
            <div 
                className="absolute inset-0 pointer-events-none transition-all duration-700"
                style={{
                    background: `radial-gradient(circle at ${currentSettings.focalX}% ${currentSettings.focalY}%, ${accentColor} 0%, transparent 70%)`,
                }} 
            />

            {url ? (
                <div
                    ref={containerRef}
                    className="w-[80%] max-w-[1000px] aspect-video relative flex items-center justify-center animate-float-cinematic"
                    style={{
                        perspective: '1500px',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <video
                        ref={videoRef}
                        src={url}
                        className="w-full h-full object-cover rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-white/5 transition-all duration-300"
                        style={{
                            transform: `rotateX(${currentSettings.tiltY}deg) rotateY(${currentSettings.tiltX}deg) scale(${currentSettings.zoom})`,
                            transformOrigin: `${currentSettings.focalX}% ${currentSettings.focalY}%`,
                        }}
                        onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime)}
                        muted
                    />

                    {/* Focal Point Indicator */}
                    <div
                        className="absolute w-6 h-6 border-2 border-blue-500/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
                        style={{ left: `${currentSettings.focalX}%`, top: `${currentSettings.focalY}%` }}
                    >
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-[30%] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                </div>
            ) : (
                <div className="text-zinc-600 text-sm font-medium tracking-tight">Upload a video to see live preview</div>
            )}

            {/* Premium Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                        Live 3D ENGINE
                    </span>
                    <span className="px-2.5 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                        Preview
                    </span>
                </div>
                <span className="text-[10px] text-zinc-600 font-medium">Click anywhere to shift camera focus</span>
            </div>

            <style jsx global>{`
                @keyframes float-cinematic {
                    0%, 100% { transform: translateY(0) rotate(0.1deg); }
                    50% { transform: translateY(-15px) rotate(-0.1deg); }
                }
                .animate-float-cinematic {
                    animation: float-cinematic 10s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
