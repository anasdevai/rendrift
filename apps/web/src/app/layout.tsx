import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FocusCast — AI-Powered Screen Demo Videos",
  description: "Transform your screen recordings into cinematic 3D product demos with AI-powered dynamic zoom and focus effects.",
  keywords: "screen recording, video editing, AI, cinematic, product demo",
  openGraph: {
    title: "FocusCast — AI-Powered Screen Demo Videos",
    description: "Transform your screen recordings into cinematic 3D product demos.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`} style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
        {/* Global ambient background */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: -1,
          background: 'var(--bg-base)',
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 20% -20%, rgba(124,58,237,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(37,99,235,0.12) 0%, transparent 60%)
          `
        }} />

        {/* Grid overlay */}
        <div className="stitch-grid" style={{ position: 'fixed', inset: 0, zIndex: -1, opacity: 0.4 }} />

        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* ===== HEADER ===== */}
          <header className="glass" style={{
            position: 'sticky', top: 0, zIndex: 100,
            borderBottom: '1px solid rgba(124,58,237,0.12)',
            padding: '0',
          }}>
            <div style={{
              maxWidth: '1280px', margin: '0 auto',
              padding: '0 24px', height: '64px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              {/* Logo */}
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.45)',
                  flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{
                  fontWeight: 800, fontSize: '20px',
                  letterSpacing: '-0.04em',
                  color: 'var(--text-primary)',
                }}>FocusCast</span>
              </Link>

              {/* Nav */}
              <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Link href="/upload" className="nav-link">Create</Link>
                <Link href="/dashboard" className="nav-link">Projects</Link>

                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', margin: '0 8px' }} />

                <Link href="/auth/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px',
                  background: 'rgba(124,58,237,0.1)',
                  color: '#b78dff',
                  borderRadius: '10px',
                  border: '1px solid rgba(124,58,237,0.25)',
                  fontSize: '14px', fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                  Sign In
                </Link>
                <Link href="/upload" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px',
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '14px', fontWeight: '700',
                  textDecoration: 'none',
                  marginLeft: '4px',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                  transition: 'all 0.2s',
                }}>
                  Start Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </nav>
            </div>
          </header>

          {/* ===== MAIN ===== */}
          <main style={{ flex: 1 }}>
            {children}
          </main>

          {/* ===== FOOTER ===== */}
          <footer style={{
            borderTop: '1px solid rgba(124,58,237,0.1)',
            padding: '48px 24px',
            background: 'rgba(13,11,24,0.6)',
          }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px',
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}>FocusCast</span>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                  {['Create', 'Projects', 'Sign In'].map(link => (
                    <span key={link} style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{link}</span>
                  ))}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  © 2026 FocusCast · Built with AI
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
