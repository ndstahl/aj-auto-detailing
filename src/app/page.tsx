'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Carousel from '@/components/Carousel'

const SERVICES = [
  { name: 'Basic Wash', price: '$40' },
  { name: 'Clay and Seal', price: '$65' },
  { name: 'Basic Interior', price: '$85' },
  { name: 'Premium Interior', price: '$145' },
  { name: 'Ultimate Interior', price: '$210' },
]

const PACKAGES = [
  {
    name: 'Maintenance Detail',
    price: '$90',
    tag: 'Monthly Plans Available',
    desc: 'Just a shine up — perfect for newer cars staying in great shape.',
    features: ['Basic interior clean', 'Exterior wash & dry', 'Monthly subscription plans', 'Ideal for newer vehicle condition'],
    glow: 'glow-btn-blue',
    featured: false,
  },
  {
    name: 'Mini Detail',
    price: '$125',
    tag: null,
    desc: 'A thorough refresh inside and out.',
    features: ['Brush & interior wipedown', 'Comprehensive air blowout', '100% hand wash & foam bathe', 'Deep wheel cleaning', '3-month exterior wax protection'],
    glow: 'glow-btn-blue',
    featured: false,
  },
  {
    name: 'Premium Detail',
    price: '$185',
    tag: 'Most Popular',
    desc: 'Everything in Mini Detail, plus the deep treatment your car deserves.',
    features: ['Everything in Mini Detail', 'Thorough trunk & compartment cleaning', 'Clay & seal exterior treatment', '5-month wax + iron decontamination', 'Pet hair removal', 'Plastic & leather conditioning'],
    glow: 'glow-btn-green',
    featured: true,
  },
  {
    name: 'Ultimate Detail',
    price: '$250',
    tag: null,
    desc: 'The complete package — inside and out, top to bottom.',
    features: ['Everything in Premium Detail', 'Steam treatment on all surfaces', 'Full interior sanitation', 'Stain removal', 'Mat & trim restoration'],
    glow: 'glow-btn-cyan',
    featured: false,
  },
  {
    name: 'Polishing Package',
    price: '$500',
    tag: null,
    desc: 'Paint correction for a showroom-ready finish.',
    features: ['1–2 step paint correction', 'Removes 50%–95% of scratches', 'Iron decontamination', 'Clay treatment', 'Thorough exterior wash'],
    glow: 'glow-btn-cyan',
    featured: false,
  },
  {
    name: 'Ceramic Coating',
    price: '$1,000',
    tag: 'Premium Protection',
    desc: 'The last paint protection you\'ll ever need.',
    features: ['1–2 step paint correction', '5-year ceramic coating application', 'Full surface prep included'],
    glow: 'glow-btn-cyan',
    featured: false,
  },
]

const MISC_SERVICES = [
  { name: 'Headlight Restoration', price: '$65' },
  { name: 'Trim Restoration', price: '$25' },
  { name: 'Pet Hair Removal', price: 'Price varies' },
  { name: 'Water Spot Removal', price: 'Price varies' },
]


export default function Home() {
  const revealRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    revealRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const addRef = (el: HTMLElement | null) => { if (el) revealRefs.current.push(el) }

  return (
    <>
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
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: 500, color: '#aaa', letterSpacing: '0.08em' }}>San Fernando, CA · <a href="tel:8187402771" style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>(818) 740-2771</a></span>
            </div>

            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.04, letterSpacing: '-0.03em', marginBottom: 28, color: '#fff' }}>
              Your Car.<br />
              <span style={{ color: '#1e1e1e' }}>Our Obsession.</span>
            </h1>

            <p style={{ color: '#999', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.85, maxWidth: 460, marginBottom: 40 }}>
              Premium auto detailing in San Fernando. Every service is performed with professional-grade products and an eye for perfection.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/booking" className="glow-btn glow-btn-green" style={{ padding: '14px 32px', fontSize: '0.9rem' }}>
                Book an Appointment
              </Link>
              <Link href="/quote" className="glow-btn glow-btn-blue" style={{ padding: '14px 32px', fontSize: '0.9rem' }}>
                Get a Free Quote
              </Link>
            </div>
          </div>

          <div ref={addRef} className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '0 40px', marginTop: 96, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 48, width: 'fit-content' }}>
            {[['500+', 'Cars Detailed'], ['5★', 'Avg Rating'], ['5+', 'Years Exp.'], ['100%', 'Guarantee']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.75rem', color: '#fff', marginBottom: 4 }}>{n}</div>
                <div style={{ color: '#777', fontSize: '0.78rem', letterSpacing: '0.05em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CAROUSEL ── */}
      <section id="work" style={{ padding: '96px 0', background: '#080808' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div ref={addRef} className="reveal" style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>— Our Work</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Before & After</h2>
              <Link href="/gallery" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8rem', color: '#777', letterSpacing: '0.05em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#777')}
              >View full gallery →</Link>
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
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>— What We Do</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 14 }}>Our Services</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', maxWidth: 440, lineHeight: 1.85 }}>Professional-grade products, uncompromising attention to every detail.</p>
          </div>

          <div ref={addRef} className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, alignItems: 'start' }}>

            {/* Services menu card */}
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa' }}>Services & Pricing</div>
              </div>
              {SERVICES.map((s, i) => (
                <div key={s.name}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px', borderBottom: i < SERVICES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.2s', cursor: 'default' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.95rem', color: '#aaa', letterSpacing: '0.01em' }}>{s.name}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.01em' }}>{s.price}</span>
                </div>
              ))}
              <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                <Link href="/booking" className="glow-btn glow-btn-green" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '10px 20px' }}>
                  Book a Service
                </Link>
              </div>
            </div>

            {/* Biohazard disclaimer card */}
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa' }}>Biohazard Fees</div>
              </div>

              <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#888', maxWidth: 260, lineHeight: 1.5 }}>Blood & Mold</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#ccc', flexShrink: 0, marginLeft: 16 }}>$100 – $250</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#888', maxWidth: 260, lineHeight: 1.5 }}>Pet waste, vomit, bodily fluids, rodent waste</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#ccc', flexShrink: 0, marginLeft: 16 }}>$150 – $300</span>
                </div>
              </div>

              <div style={{ padding: '18px 28px' }}>
                <p style={{ fontSize: '0.78rem', color: '#aaa', lineHeight: 1.75, margin: 0 }}>
                  <span style={{ color: '#999', fontWeight: 600 }}>Disclaimer: </span>
                  Prices are subject to change based on the amount and severity of hazardous material present. Final pricing will be assessed on-site prior to service.
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
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>— Pricing</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 14 }}>Choose Your Package</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', maxWidth: 440, lineHeight: 1.85 }}>Transparent pricing, no surprises. Every service performed with professional-grade products.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {PACKAGES.map((p, i) => (
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
                    Book Now
                  </Link>
                </div>
              </div>
            ))}

            {/* Misc Services card */}
            <div ref={addRef} className="reveal pkg-card" style={{ transitionDelay: `${PACKAGES.length * 70}ms` }}>
              <div className="pkg-inner">
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em', color: '#fff', lineHeight: 1 }}>Misc. Services</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#777', marginTop: 6 }}>À la carte add-ons</div>
                </div>

                <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />

                <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, flex: 1 }}>
                  {MISC_SERVICES.map(s => (
                    <li key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13, paddingBottom: 13, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: '#aaa', fontSize: '0.82rem' }}>{s.name}</span>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: '#777', flexShrink: 0, marginLeft: 12 }}>{s.price}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/quote" className="glow-btn glow-btn-blue" style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '10px 20px' }}>
                  Get a Free Quote
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
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>— Why Us</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 28 }}>Why Choose AJ Auto Detailing?</h2>
            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.95, marginBottom: 20 }}>
              In a market full of quick-turnaround car washes and impersonal chain services, AJ Auto Detailing stands apart by doing something simple — taking the time to do it right. Every vehicle we service receives our full, undivided attention from start to finish. We don't cut corners, rush through steps, or treat your car like just another job. We treat it like our own.
            </p>
            <p style={{ color: '#999', fontSize: '0.95rem', lineHeight: 1.95, marginBottom: 28 }}>
              With over five years of hands-on, certified detailing experience and a commitment to using only professional-grade products, we deliver results that speak for themselves. Whether you need a basic maintenance wash or a full ceramic coating service, you'll receive the same level of precision and care at every tier. Our reputation is built on trust, quality, and the kind of customer satisfaction that keeps people coming back — and sending their friends our way.
            </p>
            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.9 }}>
              We proudly serve customers throughout the greater Los Angeles area, covering a <strong style={{ color: '#aaa', fontWeight: 600 }}>50-mile service radius</strong> from San Fernando — so exceptional detailing is never far from your door.
            </p>
          </div>

          {/* Service Radius + fee notice */}
          <div ref={addRef} className="reveal" style={{ transitionDelay: '100ms', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Radius card */}
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', marginBottom: 0 }}>Service Area</div>
              </div>
              <div style={{ padding: '24px 28px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '2.4rem', letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>50</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#999' }}>mile radius from San Fernando, CA</span>
                </div>
                <p style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.8, marginBottom: 0 }}>
                  We come to you. Whether you're across town or across the valley, we've got you covered within our full service area.
                </p>
              </div>
            </div>

            {/* Travel fee notice */}
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa' }}>Travel Fee</div>
              </div>
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.88rem', color: '#aaa' }}>Within 20 miles</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#22c55e' }}>No charge</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.88rem', color: '#aaa' }}>20 – 50 miles</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>$20 flat fee</span>
                </div>
                <p style={{ color: '#aaa', fontSize: '0.78rem', lineHeight: 1.75, marginTop: 16, marginBottom: 0 }}>
                  A flat $20 travel fee applies to any service location beyond the 20-mile mark within our service area. No hidden charges — just straightforward, honest pricing.
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
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 28 }}>— Our Mission</div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', lineHeight: 1.35, letterSpacing: '-0.02em', color: '#fff', marginBottom: 40 }}>
              AJ Auto Detailing — our mission is to restore every vehicle to a like-new condition through precision care and unmatched attention to detail.
            </p>
          </div>
          <div ref={addRef} className="reveal" style={{ transitionDelay: '100ms' }}>
            <p style={{ color: '#999', fontSize: '1rem', lineHeight: 2, marginBottom: 24, maxWidth: 720, margin: '0 auto 24px' }}>
              We believe every car deserves to be treated with respect — no matter the make, model, or condition it arrives in. From a simple wash to a full ceramic coating, we approach every job with the same obsessive attention to detail and commitment to quality.
            </p>
            <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 2, maxWidth: 680, margin: '0 auto 56px' }}>
              Our goal is simple: to leave every customer completely satisfied, knowing their vehicle received world-class care. We take pride in our craft and stand behind every service we perform — because your trust is earned one perfectly detailed car at a time.
            </p>
          </div>
          <div ref={addRef} className="reveal" style={{ transitionDelay: '200ms' }}>
            <div style={{ display: 'inline-block', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 40 }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontStyle: 'italic', fontSize: '1.05rem', color: '#777', letterSpacing: '0.01em' }}>
                "We don't just clean cars — we restore confidence."
              </p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginTop: 12 }}>
                — AJ, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div ref={addRef} className="reveal">
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', marginBottom: 14 }}>Ready to Book?</h2>
          <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: 36 }}>Schedule online in under 2 minutes.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/booking" className="glow-btn glow-btn-green" style={{ padding: '14px 36px', fontSize: '0.9rem' }}>Book Now</Link>
            <Link href="/quote" className="glow-btn glow-btn-blue" style={{ padding: '14px 36px', fontSize: '0.9rem' }}>Get a Free Quote</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
