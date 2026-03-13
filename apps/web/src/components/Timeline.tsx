'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Keyframe } from '@/types';
import { Plus, Trash2, Clock, Play, Pause } from 'lucide-react';
import { clsx } from 'clsx';

interface TimelineProps {
    duration: number;
    currentTime: number;
    keyframes: Keyframe[];
    onSeek: (time: number) => void;
    onAddKeyframe: (time: number) => void;
    onRemoveKeyframe: (index: number) => void;
    onSelectKeyframe: (index: number) => void;
    selectedIndex: number | null;
    isPlaying?: boolean;
    onTogglePlay?: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
    duration,
    currentTime,
    keyframes,
    onSeek,
    onAddKeyframe,
    onRemoveKeyframe,
    onSelectKeyframe,
    selectedIndex,
    isPlaying = false,
    onTogglePlay,
}) => {
    const barRef = useRef<HTMLDivElement>(null);

    const handleBarClick = (e: React.MouseEvent) => {
        if (!barRef.current) return;
        const rect = barRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const time = (x / rect.width) * duration;
        onSeek(time);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-zinc-500" />
                    <span className="text-xl font-mono font-bold text-blue-500">
                        {formatTime(currentTime)} <span className="text-zinc-700 text-sm">/ {formatTime(duration)}</span>
                    </span>
                    <button
                        onClick={onTogglePlay}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                </div>
                <button
                    onClick={() => onAddKeyframe(currentTime)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Keyframe
                </button>
            </div>

            <div className="relative group pt-4">
                {/* Progress Bar */}
                <div
                    ref={barRef}
                    onClick={handleBarClick}
                    className="h-12 w-full bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer relative overflow-hidden"
                >
                    {/* Current Time Indicator */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ left: `${(currentTime / duration) * 100}%` }}
                    />

                    {/* Keyframe Markers */}
                    {keyframes.map((kf, i) => (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectKeyframe(i);
                                onSeek(kf.time);
                            }}
                            className={clsx(
                                "absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-2 transition-all z-20",
                                selectedIndex === i ? "bg-white border-blue-500 scale-125" : "bg-zinc-700 border-zinc-500 hover:border-white"
                            )}
                            style={{ left: `${(kf.time / duration) * 100}%` }}
                        />
                    ))}

                    {/* Time Grids */}
                    <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-10">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-full w-px bg-white" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Keyframe List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {keyframes.map((kf, i) => (
                    <div
                        key={i}
                        onClick={() => onSelectKeyframe(i)}
                        className={clsx(
                            "p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group",
                            selectedIndex === i ? "border-blue-500 bg-blue-500/10" : "border-zinc-800 bg-zinc-800/50 hover:border-zinc-700"
                        )}
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">Point {i + 1}</span>
                            <span className="text-sm font-mono text-zinc-300">{formatTime(kf.time)}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveKeyframe(i);
                            }}
                            className="p-1 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
