'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '#services', label: 'Services' },
    { href: '#packages', label: 'Packages' },
    { href: '/gallery', label: 'Gallery' },
  ]

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        padding: '0 24px',
        transition: 'background 0.3s, box-shadow 0.3s',
        background: scrolled ? 'rgba(8,8,8,0.95)' : 'transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 2 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.05em', color: '#fff' }}>
            AJ AUTO
          </span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.3em', color: '#aaa', textTransform: 'uppercase' }}>
            DETAILING
          </span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: 36, listStyle: 'none', margin: 0 }} className="hidden-mobile">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
              >{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }} className="hidden-mobile">
          <a href="tel:8187402771" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: '#777', letterSpacing: '0.05em', transition: 'color 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#777')}
          >(818) 740-2771</a>
          <Link href="/quote" className="glow-btn glow-btn-cyan" style={{ padding: '9px 20px', fontSize: '0.78rem' }}>
            Get a Free Quote
          </Link>
          <Link href="/booking" className="glow-btn glow-btn-green" style={{ padding: '9px 20px', fontSize: '0.78rem' }}>
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
          className="mobile-only"
          aria-label="Menu"
        >
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 1.5, background: '#fff', borderRadius: 2,
              transition: 'all 0.2s',
              transform: menuOpen ? (i === 0 ? 'translateY(6.5px) rotate(45deg)' : i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'scaleX(0)') : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'rgba(8,8,8,0.98)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px 28px' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '12px 0', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', fontWeight: 500, color: '#888', borderBottom: '1px solid rgba(255,255,255,0.04)', letterSpacing: '0.05em' }}
            >{l.label}</Link>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Link href="/quote" className="glow-btn glow-btn-cyan" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Get a Free Quote</Link>
            <Link href="/booking" className="glow-btn glow-btn-green" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Book Now</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
      `}</style>
    </nav>
  )
}
