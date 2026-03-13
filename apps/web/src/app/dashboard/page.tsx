'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobs } from '@/lib/api';
import { Job } from '@/types';
import Link from 'next/link';

const statusMeta: Record<string, { label: string; color: string; bg: string; border: string }> = {
    done: { label: 'Completed', color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)' },
    error: { label: 'Failed', color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
    rendering: { label: 'Rendering', color: '#a78bfa', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.3)' },
    analyzing: { label: 'Analyzing', color: '#60a5fa', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.3)' },
    pending: { label: 'Queued', color: '#9ca3af', bg: 'rgba(107,114,128,0.08)', border: 'rgba(156,163,175,0.2)' },
};

function StatusBadge({ status }: { status: string }) {
    const s = statusMeta[status] || statusMeta.pending;
    const isActive = ['rendering', 'analyzing'].includes(status);
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '4px 10px', borderRadius: '999px',
            background: s.bg, border: `1px solid ${s.border}`,
            color: s.color, fontSize: '11px', fontWeight: '700',
            letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
            {isActive ? (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, animation: 'pulse-glow 1.5s ease-in-out infinite', display: 'inline-block' }} />
            ) : (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, display: 'inline-block' }} />
            )}
            {s.label}
        </span>
    );
}

function JobCard({ job }: { job: Job }) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4001';
    const videoUrl = `${serverUrl}/uploads/processed/${job.id}.mp4`;
    const isDone = job.status === 'done' && job.outputPath;

    return (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
            {/* Thumbnail area */}
            <div style={{
                aspectRatio: '16/9',
                background: 'var(--bg-surface)',
                position: 'relative', overflow: 'hidden',
                borderBottom: '1px solid var(--border-subtle)',
            }}>
                {isDone ? (
                    <>
                        <video
                            src={videoUrl}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75, transition: 'opacity 0.3s' }}
                            muted
                            onMouseEnter={e => { (e.target as HTMLVideoElement).play(); (e.target as HTMLVideoElement).style.opacity = '1'; }}
                            onMouseLeave={e => {
                                const v = e.target as HTMLVideoElement;
                                v.pause(); v.currentTime = 0;
                                v.style.opacity = '0.75';
                            }}
                        />
                        {/* Play overlay */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'radial-gradient(circle at center, rgba(124,58,237,0.2), transparent 60%)',
                            pointerEvents: 'none',
                        }}>
                            <div style={{
                                width: '44px', height: '44px',
                                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(124,58,237,0.5)',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '12px',
                    }}>
                        {['rendering', 'analyzing'].includes(job.status) ? (
                            <>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="loading-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                                    ))}
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Processing…</span>
                            </>
                        ) : job.status === 'error' ? (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        ) : (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        )}
                    </div>
                )}

                {/* Status badge overlay */}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <StatusBadge status={job.status} />
                </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px', gap: '8px' }}>
                    <div>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', fontSize: '15px' }}>
                            Demo #{job.id.slice(0, 8)}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {isDone ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                            href={`/status/${job.id}`}
                            style={{
                                flex: 1, padding: '10px',
                                background: 'rgba(124,58,237,0.08)',
                                border: '1px solid rgba(124,58,237,0.2)',
                                borderRadius: '10px',
                                color: '#a78bfa', fontSize: '13px', fontWeight: '600',
                                textDecoration: 'none', textAlign: 'center',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                transition: 'all 0.2s',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            View
                        </Link>
                        <a
                            href={videoUrl}
                            download
                            style={{
                                flex: 1, padding: '10px',
                                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.15))',
                                border: '1px solid rgba(124,58,237,0.2)',
                                borderRadius: '10px',
                                color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600',
                                textDecoration: 'none', textAlign: 'center',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download
                        </a>
                    </div>
                ) : job.status === 'error' ? (
                    <div style={{
                        padding: '10px 14px',
                        background: 'rgba(239,68,68,0.05)',
                        border: '1px solid rgba(239,68,68,0.15)',
                        borderRadius: '10px', color: '#f87171',
                        fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        Processing failed
                    </div>
                ) : (
                    <Link href={`/status/${job.id}`} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '10px',
                        background: 'rgba(124,58,237,0.06)',
                        border: '1px solid rgba(124,58,237,0.15)',
                        borderRadius: '10px', color: '#a78bfa',
                        fontSize: '13px', fontWeight: '600', textDecoration: 'none',
                    }}>
                        <div style={{ width: '14px', height: '14px', border: '2px solid rgba(167,139,250,0.3)', borderTop: '2px solid #a78bfa', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
                        Track Progress
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [jobList, setJobList] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/auth/login'); return; }
        }
        const fetchJobs = async () => {
            try {
                const res = await jobs.getAll();
                setJobList(res.data.jobs);
            } catch { } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, [router]);

    if (isLoading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2].map(i => <div key={i} className="loading-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading your projects…</p>
        </div>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '60px 24px 80px', position: 'relative' }}>
            <div className="orb-purple" style={{ top: '-100px', right: '10%', opacity: 0.4 }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
                {/* Header */}
                <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '3px 12px',
                            background: 'rgba(124,58,237,0.08)',
                            border: '1px solid rgba(124,58,237,0.2)',
                            borderRadius: '999px', color: '#a78bfa',
                            fontSize: '11px', fontWeight: '700',
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            marginBottom: '16px',
                        }}>
                            Your Workspace
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900,
                            letterSpacing: '-0.04em', margin: '0 0 8px',
                            color: 'var(--text-primary)',
                        }}>
                            Projects
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                            {jobList.length} demo{jobList.length !== 1 ? 's' : ''} · {jobList.filter(j => j.status === 'done').length} ready to download
                        </p>
                    </div>

                    <Link href="/upload" className="btn-primary" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        textDecoration: 'none', fontSize: '15px',
                        flexShrink: 0,
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        New Demo
                    </Link>
                </div>

                {/* Jobs grid */}
                {jobList.length === 0 ? (
                    <div className="animate-fade-in" style={{
                        textAlign: 'center', padding: '100px 40px',
                        background: 'var(--bg-card)',
                        border: '1px dashed var(--border-subtle)',
                        borderRadius: '28px',
                    }}>
                        <div style={{
                            width: '72px', height: '72px',
                            background: 'rgba(124,58,237,0.08)',
                            border: '1px solid rgba(124,58,237,0.2)',
                            borderRadius: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' }}>
                            No demos yet
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                            Upload your first screen recording to get started.
                        </p>
                        <Link href="/upload" className="btn-primary" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            textDecoration: 'none', fontSize: '15px',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            Create First Demo
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {jobList.map((job, i) => (
                            <div key={job.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                                <JobCard job={job} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
