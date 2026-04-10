'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Carousel from '@/components/Carousel'
import { useLanguage } from '@/lib/i18n/context'

// Dynamically import the map to avoid SSR issues with Leaflet
const ServiceAreaMap = dynamic(() => import('@/components/ServiceAreaMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: 500,
      background: 'rgba(255,255,255,0.05)',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#888'
    }}>
      Loading map...
    </div>
  )
})

export default function Home() {
  const { t, lang } = useLanguage()
  const revealRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    revealRefs.current = [] // Reset refs when language changes
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    // Small delay to ensure DOM is updated
    const timeout = setTimeout(() => {
      revealRefs.current.forEach(el => el && observer.observe(el))
    }, 50)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [lang])

  const addRef = (el: HTMLElement | null) => { if (el) revealRefs.current.push(el) }

  return (
    <>
      {/* Structured Data for Local Business SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoRepair",
            "name": "AJ Auto Detailing",
            "image": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=85",
            "description": "Professional auto detailing service in San Fernando, CA. Offering mobile detailing, paint correction, ceramic coating, and more.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "San Fernando",
              "addressRegion": "CA",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 34.2819,
              "longitude": -118.4390
            },
            "telephone": "(818) 740-2771",
            "email": "ajautodetailing2003@gmail.com",
            "priceRange": "$$$",
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 34.2819,
                "longitude": -118.4390
              },
              "geoRadius": "50 miles"
            },
            "url": process.env.NEXT_PUBLIC_SITE_URL || "https://ajautodetailing.com",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "08:00",
                "closes": "18:00"
              }
            ],
            "serviceType": [
              "Auto Detailing",
              "Car Detailing",
              "Paint Correction",
              "Ceramic Coating",
              "Interior Detailing",
              "Exterior Detailing",
              "Mobile Detailing"
            ]
          })
        }}
      />
      <Nav />

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at 30% 50%, black 10%, transparent 70%)',
        }} />
        {/* Right-side image fade */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--bg) 35%, transparent 65%)', zIndex: 2, pointerEvents: 'none' }} />

        {/* Hero image */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '52%', zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=85&fit=crop&crop=left"
            alt="Premium car detailing"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', filter: 'brightness(0.45) grayscale(0.3)' }}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', paddingTop: 100, position: 'relative', zIndex: 3 }}>
          <div ref={addRef} className="reveal" style={{ maxWidth: 600 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '6px 14px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, background: 'rgba(255,255,255,0.025)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', flexShrink: 0, display: 'inline-block' }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: 500, color: '#aaa', letterSpacing: '0.08em' }}>{t.home.hero.location} · <a href={`tel:${t.common.phone.replace(/[^0-9]/g, '')}`} style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>{t.common.phone}</a></span>
            </div>

            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.04, letterSpacing: '-0.03em', marginBottom: 28, color: '#fff' }}>
              {t.home.hero.title}<br />
              <span style={{ color: '#1e1e1e' }}>{t.home.hero.titleAccent}</span>
            </h1>

            <p style={{ color: '#999', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.85, maxWidth: 460, marginBottom: 40 }}>
              {t.home.hero.subtitle}
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/booking" className="glow-btn glow-btn-green" style={{ padding: '14px 32px', fontSize: '0.9rem' }}>
                {t.home.hero.bookAppointment}
              </Link>
              <Link href="/quote" className="glow-btn glow-btn-blue" style={{ padding: '14px 32px', fontSize: '0.9rem' }}>
                {t.home.hero.getFreeQuote}
              </Link>
            </div>
          </div>

          <div ref={addRef} className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '0 40px', marginTop: 96, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 48, width: 'fit-content' }}>
            {t.home.hero.stats.map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.75rem', color: '#fff', marginBottom: 4 }}>{stat.value}</div>
                <div style={{ color: '#777', fontSize: '0.78rem', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREA MAP ── */}
      <section style={{ padding: '80px 24px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div ref={addRef} className="reveal" style={{ marginBottom: 48, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>— Coverage Area</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 14 }}>We Come to You</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.85 }}>
              Serving the greater Los Angeles area with a <span style={{ color: '#22c55e', fontWeight: 600 }}>50-mile radius</span> from San Fernando.
              <span style={{ color: '#3b82f6', fontWeight: 600 }}> Free travel</span> within 20 miles, $20 flat fee beyond.
            </p>
          </div>
          <div ref={addRef} className="reveal" style={{ transitionDelay: '100ms' }}>
            <ServiceAreaMap />
          </div>
          <div ref={addRef} className="reveal" style={{ marginTop: 32, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#22c55e', border: '2px solid rgba(34, 197, 94, 0.3)' }} />
              <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Within 20 miles • No travel fee</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#3b82f6', border: '2px solid rgba(59, 130, 246, 0.3)' }} />
              <span style={{ color: '#aaa', fontSize: '0.85rem' }}>20-50 miles • $20 flat fee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAROUSEL ── */}
      <section id="work" style={{ padding: '96px 0', background: '#080808' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div ref={addRef} className="reveal" style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>— {t.home.work.sectionLabel}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{t.home.work.heading}</h2>
              <Link href="/gallery" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8rem', color: '#777', letterSpacing: '0.05em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#777')}
              >{t.home.work.viewGallery} →</Link>
            </div>
          </div>
          <div ref={addRef} className="reveal">
            <Carousel />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div ref={addRef} className="reveal" style={{ marginBottom: 52 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>— {t.home.services.sectionLabel}</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 14 }}>{t.home.services.heading}</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', maxWidth: 440, lineHeight: 1.85 }}>{t.home.services.description}</p>
          </div>

          <div ref={addRef} className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, alignItems: 'start' }}>

            {/* Services menu card */}
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa' }}>{t.home.services.servicesPricing}</div>
              </div>
              {t.home.services.items.map((s, i) => (
                <div key={s.name}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px', borderBottom: i < t.home.services.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.2s', cursor: 'default' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.95rem', color: '#aaa', letterSpacing: '0.01em' }}>{s.name}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.01em' }}>{s.price}</span>
                </div>
              ))}
              <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                <Link href="/booking" className="glow-btn glow-btn-green" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '10px 20px' }}>
                  {t.home.services.bookService}
                </Link>
              </div>
            </div>

            {/* Biohazard disclaimer card */}
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa' }}>{t.home.services.biohazardFees}</div>
              </div>

              <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {t.home.services.biohazardItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: i < t.home.services.biohazardItems.length - 1 ? 10 : 0 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#888', maxWidth: 260, lineHeight: 1.5 }}>{item.description}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#ccc', flexShrink: 0, marginLeft: 16 }}>{item.price}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '18px 28px' }}>
                <p style={{ fontSize: '0.78rem', color: '#aaa', lineHeight: 1.75, margin: 0 }}>
                  <span style={{ color: '#999', fontWeight: 600 }}>Disclaimer: </span>
                  {t.home.services.biohazardDisclaimer}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section id="packages" style={{ padding: '96px 0', background: '#050505' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div ref={addRef} className="reveal" style={{ marginBottom: 60 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>— {t.home.packages.sectionLabel}</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 14 }}>{t.home.packages.heading}</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', maxWidth: 440, lineHeight: 1.85 }}>{t.home.packages.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {t.home.packages.items.map((p, i) => (
              <div key={p.name} ref={addRef} className="reveal pkg-card" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className={`pkg-inner${p.featured ? ' pkg-featured' : ''}`}>
                  {p.tag && (
                    <div className="pkg-tag">{p.tag}</div>
                  )}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '2.2rem', letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>{p.price}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: p.featured ? '#ccc' : '#666', marginTop: 6 }}>{p.name}</div>
                  </div>

                  <p style={{ color: '#777', fontSize: '0.8rem', lineHeight: 1.7, marginBottom: 20, minHeight: 36 }}>{p.desc}</p>

                  <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />

                  <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, flex: 1 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#aaa', fontSize: '0.82rem', marginBottom: 9, lineHeight: 1.5 }}>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#2a2a2a', flexShrink: 0, marginTop: 6 }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href="/booking" className={`glow-btn ${p.glow}`} style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '10px 20px' }}>
                    {t.home.packages.bookNow}
                  </Link>
                </div>
              </div>
            ))}

            {/* Misc Services card */}
            <div ref={addRef} className="reveal pkg-card" style={{ transitionDelay: `${t.home.packages.items.length * 70}ms` }}>
              <div className="pkg-inner">
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em', color: '#fff', lineHeight: 1 }}>{t.home.packages.miscTitle}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#777', marginTop: 6 }}>{t.home.packages.miscSubtitle}</div>
                </div>

                <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />

                <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, flex: 1 }}>
                  {t.home.packages.miscServices.map(s => (
                    <li key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13, paddingBottom: 13, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: '#aaa', fontSize: '0.82rem' }}>{s.name}</span>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: '#777', flexShrink: 0, marginLeft: 12 }}>{s.price}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/quote" className="glow-btn glow-btn-blue" style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '10px 20px' }}>
                  {t.home.packages.getFreeQuote}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .pkg-card { display: flex; }
          .pkg-inner {
            width: 100%;
            padding: 32px 28px;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            background: rgba(255,255,255,0.01);
            display: flex;
            flex-direction: column;
            position: relative;
            transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
            overflow: hidden;
          }
          .pkg-inner::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
            transform: scaleX(0);
            transition: transform 0.4s ease;
          }
          .pkg-inner:hover {
            border-color: rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.025);
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          }
          .pkg-inner:hover::before {
            transform: scaleX(1);
          }
          .pkg-featured {
            border-color: rgba(255,255,255,0.12) !important;
            background: rgba(255,255,255,0.03) !important;
          }
          .pkg-featured:hover {
            border-color: rgba(255,255,255,0.2) !important;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
          }
          .pkg-tag {
            position: absolute;
            top: -1px; left: 50%;
            transform: translateX(-50%);
            background: #fff;
            color: #080808;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.6rem;
            font-weight: 700;
            letter-spacing: 0.18em;
            padding: 4px 14px;
            border-radius: 0 0 6px 6px;
            text-transform: uppercase;
            white-space: nowrap;
          }
        `}</style>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="why" style={{ padding: '96px 24px', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 64, alignItems: 'start' }}>

          {/* Why Choose Us */}
          <div ref={addRef} className="reveal">
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>— {t.home.why.sectionLabel}</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 28 }}>{t.home.why.heading}</h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.95, marginBottom: 20 }}>
              {t.home.why.paragraph1}
            </p>
            <p style={{ color: '#999', fontSize: '0.95rem', lineHeight: 1.95, marginBottom: 28 }}>
              {t.home.why.paragraph2}
            </p>
            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.9 }}>
              {t.home.why.paragraph3}
            </p>
          </div>

          {/* Service Radius + fee notice */}
          <div ref={addRef} className="reveal" style={{ transitionDelay: '100ms', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Radius card */}
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', marginBottom: 0 }}>{t.home.why.serviceArea}</div>
              </div>
              <div style={{ padding: '24px 28px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '2.4rem', letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>{t.home.why.serviceAreaRadius}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#999' }}>{t.home.why.serviceAreaLabel}</span>
                </div>
                <p style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.8, marginBottom: 0 }}>
                  {t.home.why.serviceAreaDescription}
                </p>
              </div>
            </div>

            {/* Travel fee notice */}
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa' }}>{t.home.why.travelFee}</div>
              </div>
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.88rem', color: '#aaa' }}>{t.home.why.withinMiles}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#22c55e' }}>{t.home.why.noCharge}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.88rem', color: '#aaa' }}>{t.home.why.beyondMiles}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{t.home.why.flatFee}</span>
                </div>
                <p style={{ color: '#aaa', fontSize: '0.78rem', lineHeight: 1.75, marginTop: 16, marginBottom: 0 }}>
                  {t.home.why.travelFeeDescription}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section id="mission" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.015) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div ref={addRef} className="reveal">
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 28 }}>— {t.home.mission.sectionLabel}</div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', lineHeight: 1.35, letterSpacing: '-0.02em', color: '#fff', marginBottom: 40 }}>
              {t.home.mission.statement}
            </p>
          </div>
          <div ref={addRef} className="reveal" style={{ transitionDelay: '100ms' }}>
            <p style={{ color: '#999', fontSize: '1rem', lineHeight: 2, marginBottom: 24, maxWidth: 720, margin: '0 auto 24px' }}>
              {t.home.mission.paragraph1}
            </p>
            <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 2, maxWidth: 680, margin: '0 auto 56px' }}>
              {t.home.mission.paragraph2}
            </p>
          </div>
          <div ref={addRef} className="reveal" style={{ transitionDelay: '200ms' }}>
            <div style={{ display: 'inline-block', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 40 }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontStyle: 'italic', fontSize: '1.05rem', color: '#777', letterSpacing: '0.01em' }}>
                "{t.home.mission.quote}"
              </p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginTop: 12 }}>
                {t.home.mission.attribution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div ref={addRef} className="reveal">
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', marginBottom: 14 }}>{t.home.cta.heading}</h2>
          <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: 36 }}>{t.home.cta.subheading}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/booking" className="glow-btn glow-btn-green" style={{ padding: '14px 36px', fontSize: '0.9rem' }}>{t.home.cta.bookNow}</Link>
            <Link href="/quote" className="glow-btn glow-btn-blue" style={{ padding: '14px 36px', fontSize: '0.9rem' }}>{t.home.cta.getFreeQuote}</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
