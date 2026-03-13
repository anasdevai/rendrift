'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { JobStatusPoller } from '@/components/JobStatusPoller';
import Link from 'next/link';

export default function StatusPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) router.push('/auth/login');
        }
    }, [router]);

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '60px 24px 80px', position: 'relative' }}>
            <div className="orb-purple" style={{ top: '-100px', left: '10%', opacity: 0.4 }} />
            <div className="orb-blue" style={{ bottom: '-100px', right: '5%', opacity: 0.3 }} />

            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                {/* Back nav */}
                <Link href="/dashboard" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: 'var(--text-muted)', fontSize: '13px',
                    textDecoration: 'none', marginBottom: '32px',
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                    Back to Projects
                </Link>

                {/* Page header */}
                <div className="animate-slide-up" style={{ marginBottom: '32px' }}>
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
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
                        Live Processing
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900,
                        letterSpacing: '-0.04em', margin: '0 0 12px',
                        color: 'var(--text-primary)',
                    }}>
                        AI is Working Its Magic
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, maxWidth: '500px' }}>
                        Your recording is being transformed into a professional cinematic demo. Sit back — this takes about 1–3 minutes.
                    </p>
                </div>

                {/* Status poller */}
                <div className="animate-slide-up delay-100">
                    <JobStatusPoller jobId={jobId} />
                </div>

                {/* FAQ */}
                <div className="animate-slide-up delay-200" style={{
                    marginTop: '32px', padding: '24px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>
                        What's happening?
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            { q: 'Frame extraction', a: 'We sample ~30 frames per minute to analyze your recording.' },
                            { q: 'AI vision analysis', a: 'GPT-4 Vision identifies clicks, navigation, and key moments.' },
                            { q: '3D rendering', a: 'Remotion renders each frame with zoom, tilt, and glow effects.' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '12px' }}>
                                <div style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: '#7c3aed', marginTop: '7px', flexShrink: 0,
                                }} />
                                <div>
                                    <div style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '2px' }}>
                                        {item.q}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                        {item.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
