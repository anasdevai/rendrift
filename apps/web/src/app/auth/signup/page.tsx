'use client';

import React, { useState } from 'react';
import { auth } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setIsLoading(true);
        try {
            const res = await auth.signup(email, password);
            localStorage.setItem('token', res.data.token);
            router.push('/upload');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create account.');
        } finally {
            setIsLoading(false);
        }
    };

    const perks = [
        '3D cinematic rendering on every video',
        'Smart AI zoom & focus tracking',
        'Export to MP4 in under 3 minutes',
        'Free for videos under 2 minutes',
    ];

    return (
        <div style={{
            minHeight: 'calc(100vh - 64px)',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            alignItems: 'stretch',
            position: 'relative',
        }}>
            {/* Left: Visual panel */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(37,99,235,0.1) 100%)',
                borderRight: '1px solid var(--border-subtle)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '80px 60px',
                position: 'relative', overflow: 'hidden',
            }}>
                <div className="orb-purple" style={{ top: '-100px', left: '-100px', opacity: 0.5 }} />
                <div className="orb-blue" style={{ bottom: '-150px', right: '-100px', opacity: 0.4 }} />

                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
                        <div style={{
                            width: '44px', height: '44px',
                            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                            borderRadius: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(124,58,237,0.5)',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>FocusCast</span>
                    </div>

                    <h2 style={{
                        fontSize: '40px', fontWeight: 900,
                        letterSpacing: '-0.04em', lineHeight: 1.1,
                        margin: '0 0 20px', color: 'var(--text-primary)',
                    }}>
                        Ship demos that<br />
                        <span className="gradient-text">actually convert.</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '48px', lineHeight: 1.65 }}>
                        Join thousands of founders using FocusCast to make their products look irresistible.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {perks.map((perk, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '22px', height: '22px', borderRadius: '6px',
                                    background: 'rgba(124,58,237,0.15)',
                                    border: '1px solid rgba(124,58,237,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{perk}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Form */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '60px 40px',
            }}>
                <div className="animate-slide-up" style={{ width: '100%', maxWidth: '400px' }}>
                    <h1 style={{
                        fontSize: '28px', fontWeight: 800,
                        letterSpacing: '-0.03em', margin: '0 0 8px',
                        color: 'var(--text-primary)',
                    }}>
                        Create your account
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 32px' }}>
                        Free to start · No credit card required
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                display: 'block', fontSize: '12px', fontWeight: '700',
                                color: 'var(--text-muted)', textTransform: 'uppercase',
                                letterSpacing: '0.08em', marginBottom: '8px',
                            }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="stitch-input"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block', fontSize: '12px', fontWeight: '700',
                                color: 'var(--text-muted)', textTransform: 'uppercase',
                                letterSpacing: '0.08em', marginBottom: '8px',
                            }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="stitch-input"
                                placeholder="Min. 6 characters"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block', fontSize: '12px', fontWeight: '700',
                                color: 'var(--text-muted)', textTransform: 'uppercase',
                                letterSpacing: '0.08em', marginBottom: '8px',
                            }}>Confirm Password</label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                className="stitch-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: '12px 16px',
                                background: 'rgba(239,68,68,0.06)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '10px', color: '#f87171',
                                fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary"
                            style={{
                                width: '100%', padding: '15px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                fontSize: '15px', marginTop: '8px',
                                opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <div style={{
                                        width: '18px', height: '18px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTop: '2px solid white', borderRadius: '50%',
                                        animation: 'spin-slow 0.8s linear infinite',
                                    }} />
                                    Creating account…
                                </>
                            ) : (
                                <>Create Free Account <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                            )}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '24px' }}>
                        Already have an account?{' '}
                        <Link href="/auth/login" style={{ color: '#a78bfa', fontWeight: '600', textDecoration: 'none' }}>
                            Sign in →
                        </Link>
                    </p>

                    <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px', lineHeight: 1.6 }}>
                        By creating an account you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
