'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    label: '3D Cinematic',
    title: 'Depth & Perspective',
    desc: 'AI automatically adds professional 3D tilt, floating effects, and shadow depth that give your demos a premium edge.',
    color: '#7c3aed',
    delay: 0,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
    label: 'Smart Zoom',
    title: 'Dynamic Focus Tracking',
    desc: 'The camera sweeps and zooms to follow every click, scroll, and interaction — like a cinematographer behind the lens.',
    color: '#2563eb',
    delay: 0.1,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    label: 'Instant Export',
    title: 'Ship in Under 3 Min',
    desc: 'Our GPU-accelerated renderer and AI pipeline work in harmony to deliver your polished MP4 before you finish your coffee.',
    color: '#06b6d4',
    delay: 0.2,
  },
];

const stats = [
  { value: '10K+', label: 'Videos Rendered' },
  { value: '< 3min', label: 'Avg Render Time' },
  { value: '4K', label: 'Max Resolution' },
  { value: 'Free', label: 'To Start' },
];

export default function LandingPage() {
  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', paddingTop: '100px', paddingBottom: '120px', textAlign: 'center', padding: '100px 24px 120px' }}>
        {/* Orbs */}
        <div className="orb-purple" style={{ top: '-200px', left: '50%', transform: 'translateX(-50%)' }} />
        <div className="orb-blue" style={{ top: '200px', right: '-150px' }} />
        <div className="orb-pink" style={{ top: '100px', left: '-200px' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div className="animate-slide-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px 6px 8px',
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '999px',
            marginBottom: '32px',
            fontSize: '13px', fontWeight: '600',
          }}>
            <span style={{
              padding: '2px 10px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              borderRadius: '999px', color: 'white', fontSize: '11px', fontWeight: '700'
            }}>NEW</span>
            <span style={{ color: '#b78dff' }}>AI Professional Tracking — now with Momentum Camera</span>
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up delay-100" style={{
            fontSize: 'clamp(52px, 8vw, 96px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            margin: '0 0 28px',
            color: 'var(--text-primary)',
          }}>
            Screen Recordings<br />
            <span className="gradient-text">That Sell.</span>
          </h1>

          {/* Sub */}
          <p className="animate-slide-up delay-200" style={{
            fontSize: '20px', color: 'var(--text-secondary)',
            maxWidth: '600px', margin: '0 auto 48px',
            lineHeight: 1.65,
          }}>
            Upload your raw screen recording. Our AI cinematographer adds dynamic zoom, 3D perspective, and cinematic focus — in minutes, not hours.
          </p>

          {/* CTA */}
          <div className="animate-slide-up delay-300" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/upload" className="btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              textDecoration: 'none', fontSize: '16px',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Start Creating Free
            </Link>
            <Link href="/auth/login" className="btn-secondary" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              textDecoration: 'none', fontSize: '15px',
            }}>
              Sign In to Dashboard
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Trust note */}
          <p className="animate-slide-up delay-400" style={{
            marginTop: '24px', color: 'var(--text-muted)', fontSize: '13px',
          }}>
            No credit card required · Videos up to 2 min free · Export in MP4
          </p>
        </div>

        {/* Demo window hero */}
        <div className="animate-slide-up delay-500" style={{
          maxWidth: '900px', margin: '80px auto 0',
          position: 'relative',
        }}>
          {/* Glow behind window */}
          <div style={{
            position: 'absolute', inset: '-30px',
            background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
            zIndex: 0,
          }} />

          <div style={{
            position: 'relative', zIndex: 1,
            background: 'var(--bg-card)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          }}>
            {/* Window chrome */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '14px 20px',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['#ff5f57', '#ffbd2e', '#28c840'].map(c => (
                <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
              <div style={{
                flex: 1, textAlign: 'center',
                fontSize: '12px', color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '6px', padding: '4px 16px', marginLeft: '8px',
                letterSpacing: '0.02em',
              }}>
                focuscast.ai — Cinematic Preview
              </div>
            </div>

            {/* Screen content */}
            <div style={{
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #0d0b18 0%, #111827 50%, #0d0b18 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }} />

              {/* Simulated zoom effect */}
              <div style={{
                width: '60%', height: '60%',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '16px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '16px',
              }}>
                <div className="animate-pulse-glow" style={{
                  width: '64px', height: '64px',
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  borderRadius: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Dynamic Zoom Active
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    AI tracking action at 34%, 67%
                  </div>
                </div>

                {/* Progress pulse */}
                <div className="progress-track" style={{ width: '80%' }}>
                  <div className="progress-bar" style={{ width: '72%' }} />
                </div>
              </div>

              {/* Corner badge */}
              <div style={{
                position: 'absolute', top: '16px', right: '16px',
                padding: '6px 12px',
                background: 'rgba(52,211,153,0.12)',
                border: '1px solid rgba(52,211,153,0.3)',
                borderRadius: '999px',
                fontSize: '12px', fontWeight: '700', color: '#34d399',
                letterSpacing: '0.05em',
              }}>
                ● RENDERING
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}>
            {stats.map((stat, i) => (
              <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${0.1 * i}s`, textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '6px' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ padding: '0 24px 120px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-block', padding: '4px 16px',
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '999px', color: '#a78bfa',
              fontSize: '12px', fontWeight: '700',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Features
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800,
              letterSpacing: '-0.03em', margin: '0 0 16px',
              color: 'var(--text-primary)',
            }}>
              Everything Your Demo Needs
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '17px', maxWidth: '550px', margin: '0 auto' }}>
              One upload. Full cinematic treatment. Zero editing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} className="glass-card animate-slide-up" style={{
                padding: '32px', animationDelay: `${f.delay}s`,
              }}>
                <div style={{
                  width: '52px', height: '52px',
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color,
                  marginBottom: '20px',
                }}>
                  {f.icon}
                </div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: f.color,
                  marginBottom: '10px',
                }}>
                  {f.label}
                </div>
                <h3 style={{
                  fontSize: '20px', fontWeight: 700,
                  color: 'var(--text-primary)', margin: '0 0 12px',
                }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BOTTOM ===== */}
      <section style={{ padding: '0 24px 120px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '64px 48px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(37,99,235,0.12) 100%)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '32px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div className="orb-purple" style={{ width: '400px', height: '400px', top: '-200px', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }} />
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
              letterSpacing: '-0.03em', margin: '0 0 16px',
              color: 'var(--text-primary)', position: 'relative',
            }}>
              Ready to Make Your Demo <span className="gradient-text">Irresistible?</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '36px', position: 'relative' }}>
              Join thousands of founders and developers who ship with FocusCast.
            </p>
            <Link href="/upload" className="btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              textDecoration: 'none', fontSize: '16px', position: 'relative',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Create Your First Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
