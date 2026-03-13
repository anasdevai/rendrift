'use client';

import React, { useState } from 'react';
import { auth } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await auth.login(email, password);
            localStorage.setItem('token', res.data.token);
            router.push('/upload');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '40px 24px', position: 'relative',
        }}>
            {/* Ambient */}
            <div className="orb-purple" style={{ top: '-200px', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }} />
            <div className="orb-blue" style={{ bottom: '-200px', right: '-100px', opacity: 0.4 }} />

            <div className="animate-slide-up" style={{ width: '100%', maxWidth: '440px', position: 'relative' }}>
                {/* Card */}
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
                }}>
                    {/* Top gradient bar */}
                    <div style={{ height: '3px', background: 'linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)' }} />

                    <div style={{ padding: '40px' }}>
                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>FocusCast</span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: '28px', fontWeight: 800,
                            letterSpacing: '-0.03em', margin: '0 0 8px',
                            color: 'var(--text-primary)',
                        }}>
                            Welcome back
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 32px' }}>
                            Log in to your FocusCast workspace
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Email */}
                            <div>
                                <label style={{
                                    display: 'block', fontSize: '12px', fontWeight: '700',
                                    color: 'var(--text-muted)', textTransform: 'uppercase',
                                    letterSpacing: '0.08em', marginBottom: '8px',
                                }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="stitch-input"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{
                                        fontSize: '12px', fontWeight: '700',
                                        color: 'var(--text-muted)', textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                    }}>
                                        Password
                                    </label>
                                    <span style={{ fontSize: '12px', color: '#a78bfa', cursor: 'pointer' }}>Forgot?</span>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="stitch-input"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {/* Error */}
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

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary"
                                style={{
                                    width: '100%', padding: '15px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    fontSize: '15px', marginTop: '8px',
                                    opacity: isLoading ? 0.7 : 1,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
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
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '20px 40px',
                        background: 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                        textAlign: 'center',
                        fontSize: '14px', color: 'var(--text-muted)',
                    }}>
                        No account?{' '}
                        <Link href="/auth/signup" style={{ color: '#a78bfa', fontWeight: '600', textDecoration: 'none' }}>
                            Create one free →
                        </Link>
                    </div>
                </div>

                {/* Social proof under card */}
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '24px' }}>
                    Secured · 10,000+ videos rendered · Free to start
                </p>
            </div>
        </div>
    );
}
