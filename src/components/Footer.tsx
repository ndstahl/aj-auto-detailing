'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import LanguageToggle from './LanguageToggle'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em', marginBottom: 4 }}>AJ AUTO DETAILING</div>
            <div style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>San Fernando, CA</div>
            <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.7 }}>
              {t.footer.tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#777', marginBottom: 20 }}>{t.footer.navigate}</div>
            {t.footer.navLinks.map((l, i) => {
              const hrefs = ['/#services', '/#packages', '/gallery', '/#about']
              return (
                <Link key={hrefs[i]} href={hrefs[i]} style={{ display: 'block', color: '#aaa', fontSize: '0.875rem', marginBottom: 10, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
                >{l.label}</Link>
              )
            })}
          </div>

          {/* Services */}
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#777', marginBottom: 20 }}>{t.footer.services}</div>
            {t.footer.servicesList.map(s => (
              <div key={s} style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: 10 }}>{s}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#777', marginBottom: 20 }}>{t.footer.contact}</div>
            <div style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: 10 }}>San Fernando, CA</div>
            <a href="tel:8187402771" style={{ display: 'block', color: '#aaa', fontSize: '0.875rem', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
            >{t.common.phone}</a>
            <a href="mailto:ajautodetailing2003@gmail.com" style={{ display: 'block', color: '#aaa', fontSize: '0.875rem', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
            >ajautodetailing2003@gmail.com</a>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <Link href="/booking" className="glow-btn glow-btn-green" style={{ padding: '8px 18px', fontSize: '0.78rem' }}>{t.common.bookNow}</Link>
              <Link href="/quote" className="glow-btn glow-btn-blue" style={{ padding: '8px 18px', fontSize: '0.78rem' }}>{t.common.getQuote}</Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
            <span style={{ color: '#aaa', fontSize: '0.8rem' }} suppressHydrationWarning>© {new Date().getFullYear()} {t.footer.allRightsReserved}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <LanguageToggle />
              <Link href="/admin" style={{ color: '#555', fontSize: '0.75rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#aaa')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}
              >Admin</Link>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#555', fontSize: '0.7rem' }}>Powered by </span>
            <a
              href="https://www.ndsdigitalstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#777', fontSize: '0.7rem', transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#777')}
            >
              NDS Digital Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
