import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Video, Easing } from 'remotion';
import React from 'react';

export const FocusComposition: React.FC<{
    videoSrc: string;
    keyframes: {
        time: number;
        tiltX: number;
        tiltY: number;
        zoom: number;
        focalX: number;
        focalY: number;
    }[];
    background: string;
}> = ({ videoSrc, keyframes, background }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTime = frame / fps;

    // Sort keyframes by time
    const sortedKfs = [...keyframes].sort((a, b) => a.time - b.time);

    const getAnimatedValue = (key: 'tiltX' | 'tiltY' | 'zoom' | 'focalX' | 'focalY') => {
        if (!sortedKfs || sortedKfs.length === 0) {
            return key === 'zoom' ? 1 : (key === 'tiltX' || key === 'tiltY' ? 0 : 50);
        }
        if (sortedKfs.length === 1) return sortedKfs[0][key] ?? (key === 'zoom' ? 1 : 50);

        const times = sortedKfs.map(k => Number(k.time)).filter(t => !isNaN(t));
        const values = sortedKfs.map(k => Number(k[key])).filter(v => !isNaN(v));

        if (times.length < 2 || values.length < 2) {
             return sortedKfs[0][key] ?? (key === 'zoom' ? 1 : 50);
        }

        return interpolate(
            currentTime,
            times,
            values,
            { 
                extrapolateLeft: 'clamp', 
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic)
            }
        );
    };

    const tiltX = getAnimatedValue('tiltX');
    const tiltY = getAnimatedValue('tiltY');
    const zoom = getAnimatedValue('zoom');
    const focalX = getAnimatedValue('focalX');
    const focalY = getAnimatedValue('focalY');

    // Cinematic floating motion
    const idleRotate = interpolate(
        Math.sin(currentTime * 0.5), 
        [-1, 1],
        [-0.8, 0.8]
    );

    const idleTranslate = interpolate(
        Math.cos(currentTime * 0.4),
        [-1, 1],
        [-15, 15]
    );

    const bgColor = background === 'light-gradient' ? '#f4f4f5' : '#050506';
    const accentColor = background === 'light-gradient' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.15)';

    return (
        <AbsoluteFill style={{
            backgroundColor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Ambient Background Blur/Glow */}
            <AbsoluteFill style={{
                background: `radial-gradient(circle at ${focalX}% ${focalY}%, ${accentColor} 0%, transparent 70%)`,
                transition: 'background 0.5s ease-out'
            }} />

            <div style={{
                width: '80%',
                maxWidth: '1200px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `translateY(${idleTranslate}px) rotate(${idleRotate}deg)`,
            }}>
                <div style={{
                    width: '100%',
                    perspective: '1500px',
                }}>
                    <Video
                        src={videoSrc}
                        style={{
                            width: '100%',
                            borderRadius: '24px',
                            boxShadow: `0 ${30 + (zoom * 20)}px ${60 + (zoom * 40)}px -20px rgba(0, 0, 0, 0.6)`,
                            transform: `rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(${zoom})`,
                            transformOrigin: `${focalX}% ${focalY}%`,
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            backgroundColor: '#000'
                        }}
                    />
                </div>
            </div>
        </AbsoluteFill>
    );
};
