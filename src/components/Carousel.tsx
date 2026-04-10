'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

type CarouselImage = { id: string; url: string; alt_text?: string }

const PLACEHOLDERS: CarouselImage[] = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1400&q=85&fit=crop', alt_text: 'Before & After — Full Detail' },
  { id: 'p2', url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1400&q=85&fit=crop', alt_text: 'Before & After — Interior Detail' },
  { id: 'p3', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1400&q=85&fit=crop', alt_text: 'Before & After — Paint Correction' },
  { id: 'p4', url: 'https://images.unsplash.com/photo-1600706432502-77a0e2e32790?w=1400&q=85&fit=crop', alt_text: 'Before & After — Exterior Polish' },
  { id: 'p5', url: 'https://images.unsplash.com/photo-1543796076-b4a7e7e90c3d?w=1400&q=85&fit=crop', alt_text: 'Before & After — Ceramic Coating' },
  { id: 'p6', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400&q=85&fit=crop', alt_text: 'Before & After — Wheel Detail' },
  { id: 'p7', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=85&fit=crop', alt_text: 'Before & After — Full Restoration' },
]

export default function Carousel() {
  const [fetchedImages, setFetchedImages] = useState<CarouselImage[]>([])

  useEffect(() => {
    fetch('/api/gallery/list?category=carousel')
      .then(r => r.json())
      .then(d => { if (d.images?.length) setFetchedImages(d.images) })
      .catch(() => {})
  }, [])

  const slides = fetchedImages.length > 0 ? fetchedImages : PLACEHOLDERS
  const usingPlaceholders = fetchedImages.length === 0

  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [animating, setAnimating] = useState(false)
  const [paused, setPaused] = useState(false)

  const go = useCallback((idx: number, dir: 'next' | 'prev' = 'next') => {
    if (animating || idx === current) return
    setDirection(dir)
    setPrev(current)
    setCurrent(idx)
    setAnimating(true)
    setTimeout(() => { setPrev(null); setAnimating(false) }, 600)
  }, [animating, current])

  const goNext = useCallback(() => go((current + 1) % slides.length, 'next'), [current, slides.length, go])
  const goPrev = useCallback(() => go((current - 1 + slides.length) % slides.length, 'prev'), [current, slides.length, go])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(goNext, 5000)
    return () => clearTimeout(t)
  }, [current, paused, goNext])

  const enterX = direction === 'next' ? '6%' : '-6%'
  const exitX  = direction === 'next' ? '-6%' : '6%'

  return (
    <div
      style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', userSelect: 'none' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {usingPlaceholders && (
        <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10, fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', padding: '3px 9px', borderRadius: 4, background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.08)', color: '#3a3a3a', textTransform: 'uppercase' }}>
          Placeholder · Replace via Dashboard
        </div>
      )}

      {/* Slide stack */}
      <div style={{ aspectRatio: '21/8', position: 'relative', overflow: 'hidden' }}>

        {/* Outgoing slide */}
        {prev !== null && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slides[prev].url}
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.72)',
              transform: animating ? `translateX(${exitX}) scale(1.04)` : 'translateX(0) scale(1)',
              opacity: animating ? 0 : 1,
              transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease',
            }}
          />
        )}

        {/* Incoming slide */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={slides[current].url}
          alt={slides[current].alt_text || 'AJ Auto Detailing'}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            filter: 'brightness(0.72)',
            transform: animating ? 'translateX(0) scale(1)' : 'translateX(0) scale(1)',
            opacity: animating ? 1 : 1,
            animation: animating ? `slideIn 0.6s cubic-bezier(0.4,0,0.2,1) forwards` : 'none',
            '--enter-x': enterX,
          } as React.CSSProperties}
        />

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)', zIndex: 2 }} />

        {/* Caption */}
        {slides[current].alt_text && (
          <div style={{
            position: 'absolute', bottom: 18, left: 22, right: 80, zIndex: 3,
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.82rem', fontWeight: 500,
            color: 'rgba(255,255,255,0.5)', letterSpacing: '0.03em',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s',
          }}>
            {slides[current].alt_text}
          </div>
        )}
      </div>

      {/* Prev / Next buttons */}
      <button onClick={goPrev} aria-label="Previous" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', fontSize: '1.1rem', transition: 'all 0.2s', backdropFilter: 'blur(6px)', zIndex: 5 }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
      >‹</button>
      <button onClick={goNext} aria-label="Next" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', fontSize: '1.1rem', transition: 'all 0.2s', backdropFilter: 'blur(6px)', zIndex: 5 }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
      >›</button>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 18, right: 20, display: 'flex', gap: 5, zIndex: 5 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i, i > current ? 'next' : 'prev')} aria-label={`Slide ${i + 1}`}
            style={{ width: i === current ? 18 : 5, height: 5, borderRadius: 3, border: 'none', background: i === current ? '#fff' : 'rgba(255,255,255,0.18)', cursor: 'pointer', padding: 0, transition: 'all 0.35s ease' }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.04)', zIndex: 5 }}>
        <div key={`${current}-${paused}`} style={{
          height: '100%', background: 'rgba(255,255,255,0.18)', borderRadius: 2,
          animation: paused ? 'none' : 'carouselProgress 5s linear forwards',
          width: paused ? '0%' : undefined,
        }} />
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(var(--enter-x)) scale(1.04); opacity: 0.3; }
          to   { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes carouselProgress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  )
}
