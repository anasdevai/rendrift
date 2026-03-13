'use client';

import React, { useEffect, useState } from 'react';
import { jobs } from '@/lib/api';
import { Job, JobStep } from '@/types';

interface JobStatusPollerProps {
    jobId: string;
    onDone?: (job: Job) => void;
}

const STEPS: { key: JobStep; label: string; desc: string }[] = [
    { key: 'queued', label: 'Upload Received', desc: 'Video safely queued for processing' },
    { key: 'extracting_frames', label: 'Extracting Frames', desc: 'Sampling key frames from your recording' },
    { key: 'analyzing_video', label: 'AI Vision Analysis', desc: 'Detecting clicks, scrolls, and interactions' },
    { key: 'generating_script', label: 'Director Planning', desc: 'Writing cinematic zoom & focus script' },
    { key: 'rendering_video', label: 'GPU Rendering', desc: 'Applying 3D effects and dynamic zoom' },
    { key: 'complete', label: 'Complete', desc: 'Your cinematic demo is ready!' },
];

export const JobStatusPoller: React.FC<JobStatusPollerProps> = ({ jobId, onDone }) => {
    const [job, setJob] = useState<Job | null>(null);
    const [pollError, setPollError] = useState<string | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        const poll = async () => {
            try {
                const res = await jobs.get(jobId);
                setJob(res.data);
                if (res.data.status === 'done' || res.data.status === 'error') {
                    clearInterval(interval);
                    if (res.data.status === 'done' && onDone) onDone(res.data);
                }
            } catch (err: any) {
                setPollError(err.response?.data?.error || 'Failed to fetch status');
                clearInterval(interval);
            }
        };
        poll();
        interval = setInterval(poll, 3000);
        return () => clearInterval(interval);
    }, [jobId, onDone]);

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4001';
    const videoUrl = `${serverUrl}/uploads/processed/${jobId}.mp4`;

    const currentStepIndex = job ? STEPS.findIndex(s => s.key === job.currentStep) : -1;
    const isDone = job?.status === 'done';
    const isError = job?.status === 'error';
    const progress = isDone ? 100 : currentStepIndex >= 0 ? Math.round((currentStepIndex / (STEPS.length - 1)) * 100) : 0;

    if (pollError) return (
        <div style={{
            padding: '24px', background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px',
            display: 'flex', alignItems: 'center', gap: '12px', color: '#f87171',
        }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{pollError}</span>
        </div>
    );

    if (!job) return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '32px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#7c3aed',
                        animation: 'bounce-dot 1.4s ease-in-out infinite both',
                        animationDelay: `${i * 0.2}s`,
                    }} />
                ))}
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Connecting to job…</span>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Progress Header */}
            <div style={{
                padding: '28px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isDone ? (
                            <div style={{
                                width: '36px', height: '36px',
                                background: 'rgba(52,211,153,0.1)',
                                border: '1px solid rgba(52,211,153,0.3)',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                        ) : isError ? (
                            <div style={{
                                width: '36px', height: '36px',
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </div>
                        ) : (
                            <div style={{
                                width: '36px', height: '36px',
                                background: 'rgba(124,58,237,0.1)',
                                border: '1px solid rgba(124,58,237,0.3)',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <div style={{
                                    width: '18px', height: '18px',
                                    border: '2px solid rgba(124,58,237,0.3)',
                                    borderTop: '2px solid #7c3aed',
                                    borderRadius: '50%',
                                    animation: 'spin-slow 0.8s linear infinite',
                                }} />
                            </div>
                        )}
                        <div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px', marginBottom: '2px' }}>
                                {isDone ? '🎬 Your demo is ready!' : isError ? 'Processing failed' : 'Processing your video…'}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'monospace' }}>
                                Job: {jobId.slice(0, 12)}…
                            </div>
                        </div>
                    </div>
                    <div style={{
                        padding: '6px 16px',
                        background: isDone ? 'rgba(52,211,153,0.08)' : isError ? 'rgba(239,68,68,0.08)' : 'rgba(124,58,237,0.08)',
                        border: `1px solid ${isDone ? 'rgba(52,211,153,0.3)' : isError ? 'rgba(239,68,68,0.3)' : 'rgba(124,58,237,0.3)'}`,
                        borderRadius: '999px',
                        color: isDone ? '#34d399' : isError ? '#f87171' : '#a78bfa',
                        fontSize: '13px', fontWeight: '700',
                    }}>
                        {progress}%
                    </div>
                </div>

                {/* Progress bar */}
                <div className="progress-track">
                    <div className="progress-bar" style={{
                        width: `${progress}%`,
                        background: isDone ? 'linear-gradient(90deg, #34d399, #10b981)' :
                            isError ? 'linear-gradient(90deg, #f87171, #ef4444)' :
                            'linear-gradient(90deg, #7c3aed, #2563eb)',
                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                </div>
            </div>

            {/* Steps */}
            <div style={{
                padding: '28px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
            }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 24px' }}>
                    Pipeline Steps
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {STEPS.map((step, i) => {
                        const isComplete = i < currentStepIndex || isDone;
                        const isCurrent = i === currentStepIndex && !isDone && !isError;
                        return (
                            <div key={step.key} className="timeline-step" style={{ paddingBottom: i < STEPS.length - 1 ? '24px' : '0' }}>
                                <div className={`step-indicator ${isComplete ? 'step-done' : isCurrent ? 'step-active' : 'step-pending'}`}>
                                    {isComplete ? (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                    ) : isCurrent ? (
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a78bfa', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
                                    ) : (
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', opacity: 0.3 }} />
                                    )}
                                </div>
                                <div style={{ paddingTop: '2px' }}>
                                    <div style={{
                                        fontWeight: isCurrent ? '700' : '500',
                                        fontSize: '14px',
                                        color: isComplete ? '#34d399' : isCurrent ? '#a78bfa' : 'var(--text-muted)',
                                        marginBottom: '3px',
                                    }}>
                                        {step.label}
                                        {isCurrent && (
                                            <span style={{ marginLeft: '8px', fontSize: '11px', color: '#7c3aed', fontWeight: '700' }}>IN PROGRESS</span>
                                        )}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                        {step.desc}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Done: Video Preview */}
            {isDone && (
                <div className="animate-slide-up" style={{
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(52,211,153,0.2)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '3px',
                        background: 'linear-gradient(90deg, #34d399, #10b981, #06b6d4)',
                    }} />
                    <div style={{ padding: '28px' }}>
                        <h3 style={{
                            fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)',
                            margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <span>🎬</span> Your Cinematic Demo
                        </h3>

                        <div style={{
                            borderRadius: '14px', overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.06)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                            marginBottom: '20px',
                        }}>
                            <video
                                src={videoUrl}
                                controls
                                style={{ width: '100%', display: 'block' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <a
                                href={videoUrl}
                                download
                                className="btn-primary"
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '8px',
                                    textDecoration: 'none', fontSize: '15px', padding: '14px',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Download MP4
                            </a>
                            <button
                                onClick={() => window.location.href = '/upload'}
                                className="btn-secondary"
                                style={{ fontSize: '15px', padding: '14px 24px' }}
                            >
                                New Demo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error state */}
            {isError && (
                <div style={{
                    padding: '24px',
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '16px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span style={{ fontWeight: '600', color: '#f87171' }}>Processing Failed</span>
                    </div>
                    {job.errorMessage && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                            {job.errorMessage}
                        </p>
                    )}
                    <button
                        onClick={() => window.location.href = '/upload'}
                        className="btn-primary"
                        style={{ fontSize: '14px', padding: '12px 24px' }}
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};
