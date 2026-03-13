'use client';

import React from 'react';
import { VideoSettings } from '@/types';
import { VideoBackground } from '@/types';
import { Monitor, Moon, Sun } from 'lucide-react';

interface SettingsPanelProps {
    settings: {
        background: VideoBackground;
        tiltX: number;
        tiltY: number;
        zoom: number;
        focalX: number;
        focalY: number;
    };
    onChange: (updates: Partial<SettingsPanelProps['settings']>) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
    const update = <K extends keyof SettingsPanelProps['settings']>(
        key: K,
        value: SettingsPanelProps['settings'][K]
    ) => {
        onChange({ [key]: value });
    };


    return (
        <div className="space-y-8 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Background</h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'dark-gradient', icon: Moon, label: 'Dark' },
                        { id: 'light-gradient', icon: Sun, label: 'Light' },
                        { id: 'device-mockup', icon: Monitor, label: 'Mockup' },
                    ].map((bg) => (
                        <button
                            key={bg.id}
                            onClick={() => update('background', bg.id as VideoBackground)}
                            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${settings.background === bg.id
                                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                : 'border-zinc-800 bg-zinc-800/50 text-zinc-500 hover:border-zinc-700'
                                }`}
                        >
                            <bg.icon className="w-5 h-5" />
                            <span className="text-xs">{bg.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-zinc-300">Horizontal Tilt</label>
                        <span className="text-xs text-zinc-500">{settings.tiltX}°</span>
                    </div>
                    <input
                        type="range"
                        min="-15"
                        max="15"
                        value={settings.tiltX}
                        onChange={(e) => update('tiltX', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-zinc-300">Vertical Tilt</label>
                        <span className="text-xs text-zinc-500">{settings.tiltY}°</span>
                    </div>
                    <input
                        type="range"
                        min="-15"
                        max="15"
                        value={settings.tiltY}
                        onChange={(e) => update('tiltY', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-zinc-300">Zoom Level</label>
                        <span className="text-xs text-zinc-500">{settings.zoom}x</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={settings.zoom}
                        onChange={(e) => update('zoom', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};
