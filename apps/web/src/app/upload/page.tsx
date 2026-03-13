'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jobs } from '@/lib/api';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) router.push('/auth/login');
        }
    }, [router]);

    const handleFile = (f: File) => {
        if (!f.type.startsWith('video/')) {
            setError('Please upload a video file (MP4, MOV, etc.)');
            return;
        }
        if (f.size > 100 * 1024 * 1024) {
            setError('File too large. Max 100MB allowed.');
            return;
        }
        setFile(f);
        setError(null);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, []);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setError(null);
        setProgress(0);

        const interval = setInterval(() => setProgress(p => Math.min(p + Math.random() * 8, 85)), 400);

        try {
            const res = await jobs.create(file);
            clearInterval(interval);
            setProgress(100);
            setTimeout(() => router.push(`/status/${res.data.jobId}`), 500);
        } catch (err: any) {
            clearInterval(interval);
            setProgress(0);
            setError(err.response?.data?.error || err.message || 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const steps = [
        { num: '01', title: 'Upload Recording', desc: 'Drop any screen recording — MP4, MOV, WebM.' },
        { num: '02', title: 'AI Analyzes', desc: 'Our Vision AI identifies clicks, navigation, and key moments.' },
        { num: '03', title: 'Director Renders', desc: 'Virtual cinematographer adds zoom, tilt, and 3D depth.' },
        { num: '04', title: 'Download & Ship', desc: 'Get your polished demo MP4 in minutes.' },
    ];

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '60px 24px 80px', position: 'relative' }}>
            {/* Ambient glow */}
            <div className="orb-purple" style={{ top: '-100px', left: '50%', transform: 'translateX(-50%)', opacity: 0.6 }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
                {/* Header */}
                <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '4px 14px',
                        background: 'rgba(124,58,237,0.08)',
                        border: '1px solid rgba(124,58,237,0.2)',
                        borderRadius: '999px', color: '#a78bfa',
                        fontSize: '12px', fontWeight: '700',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        marginBottom: '20px',
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        AI Video Studio
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900,
                        letterSpacing: '-0.04em', margin: '0 0 16px',
                        color: 'var(--text-primary)',
                    }}>
                        Upload Your <span className="gradient-text">Recording</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '520px', margin: '0 auto' }}>
                        Drop your screen recording and get a cinematic demo in under 3 minutes. Zero editing.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>
                    {/* Left: Drop zone + upload */}
                    <div className="animate-slide-up delay-100">
                        {/* Drop Zone */}
                        <div
                            className={`drop-zone ${isDragging ? 'active' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => document.getElementById('file-input')?.click()}
                            style={{ padding: '80px 40px', textAlign: 'center', position: 'relative', cursor: 'pointer' }}
                        >
                            <input
                                id="file-input"
                                type="file"
                                accept="video/*"
                                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                                style={{ display: 'none' }}
                            />

                            {file ? (
                                <div>
                                    {/* File preview state */}
                                    <div style={{
                                        width: '72px', height: '72px',
                                        background: 'rgba(52,211,153,0.1)',
                                        border: '1px solid rgba(52,211,153,0.3)',
                                        borderRadius: '18px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 20px',
                                    }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                            <polyline points="22 4 12 14.01 9 11.01"/>
                                        </svg>
                                    </div>
                                    <div style={{ color: '#34d399', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>
                                        {file.name}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type}
                                    </div>
                                    <button
                                        onClick={e => { e.stopPropagation(); setFile(null); }}
                                        style={{
                                            marginTop: '20px', padding: '8px 20px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px', color: 'var(--text-muted)',
                                            cursor: 'pointer', fontSize: '13px',
                                        }}
                                    >
                                        Change File
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{
                                        width: '72px', height: '72px',
                                        background: 'rgba(124,58,237,0.08)',
                                        border: '2px dashed rgba(124,58,237,0.3)',
                                        borderRadius: '18px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 24px',
                                        transition: 'all 0.3s',
                                        ...(isDragging ? { background: 'rgba(124,58,237,0.15)', borderColor: '#7c3aed' } : {}),
                                    }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                    </div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '20px', marginBottom: '10px' }}>
                                        {isDragging ? 'Drop it here!' : 'Drag & drop your video'}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                                        or click to browse files
                                    </div>
                                    <div style={{
                                        display: 'inline-flex', gap: '8px',
                                    }}>
                                        {['MP4', 'MOV', 'WebM', 'AVI'].map(ext => (
                                            <span key={ext} style={{
                                                padding: '3px 10px',
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                borderRadius: '6px', color: 'var(--text-muted)',
                                                fontSize: '12px', fontWeight: '600',
                                            }}>{ext}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                marginTop: '16px', padding: '14px 18px',
                                background: 'rgba(239,68,68,0.05)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '12px', color: '#f87171',
                                fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                {error}
                            </div>
                        )}

                        {/* Upload progress */}
                        {isUploading && (
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                    <span style={{ color: '#a78bfa', fontWeight: '600' }}>Uploading & queueing job…</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{Math.round(progress)}%</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )}

                        {/* Upload button */}
                        <button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className="btn-primary"
                            style={{
                                width: '100%', marginTop: '20px',
                                fontSize: '16px', padding: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                opacity: !file || isUploading ? 0.5 : 1,
                                cursor: !file || isUploading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isUploading ? (
                                <>
                                    <div style={{
                                        width: '20px', height: '20px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTop: '2px solid white',
                                        borderRadius: '50%',
                                        animation: 'spin-slow 0.8s linear infinite',
                                    }} />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                    Generate Cinematic Demo
                                </>
                            )}
                        </button>

                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '12px' }}>
                            Max 100MB · Rendered in under 3 min · Free tier available
                        </p>
                    </div>

                    {/* Right: How it works */}
                    <div className="animate-slide-up delay-200">
                        <div style={{
                            padding: '32px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '20px',
                        }}>
                            <h2 style={{
                                fontSize: '18px', fontWeight: 700,
                                color: 'var(--text-primary)', margin: '0 0 28px',
                                display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                                <span style={{
                                    width: '28px', height: '28px',
                                    background: 'rgba(124,58,237,0.12)',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                                </span>
                                How It Works
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                {steps.map((step, i) => (
                                    <div key={i} className="timeline-step" style={{ paddingBottom: i < steps.length - 1 ? '24px' : '0' }}>
                                        <div className="step-indicator step-pending" style={{
                                            background: 'rgba(124,58,237,0.08)',
                                            borderColor: 'rgba(124,58,237,0.25)',
                                            color: '#7c3aed',
                                            fontSize: '10px', fontWeight: '800',
                                        }}>
                                            {step.num}
                                        </div>
                                        <div style={{ paddingTop: '2px' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '15px' }}>
                                                {step.title}
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.55 }}>
                                                {step.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tier info */}
                        <div style={{
                            marginTop: '16px', padding: '20px 24px',
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(37,99,235,0.06))',
                            border: '1px solid rgba(124,58,237,0.15)',
                            borderRadius: '16px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#a78bfa"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                <span style={{ color: '#a78bfa', fontWeight: '700', fontSize: '14px' }}>Free Tier</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[
                                    'Videos up to 2 minutes',
                                    'Max 100MB file size',
                                    'Dynamic zoom & 3D tilt',
                                    'MP4 export',
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
