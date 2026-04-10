'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import GalleryGrid from '@/components/GalleryGrid'
import { useLanguage } from '@/lib/i18n/context'

// Demo images from Unsplash for client presentation
const DEMO_IMAGES = [
  { id: '1', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80&fit=crop', alt_text: 'Premium Exterior Detail' },
  { id: '2', url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80&fit=crop', alt_text: 'Interior Deep Clean' },
  { id: '3', url: 'https://images.unsplash.com/photo-1600705722796-846b1269b5a4?w=800&q=80&fit=crop', alt_text: 'Paint Correction' },
  { id: '4', url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80&fit=crop', alt_text: 'Professional Wash' },
  { id: '5', url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80&fit=crop', alt_text: 'Ceramic Coating Application' },
  { id: '6', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&fit=crop', alt_text: 'Engine Bay Detail' },
  { id: '7', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80&fit=crop', alt_text: 'Wheel & Tire Detail' },
  { id: '8', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80&fit=crop', alt_text: 'Luxury Vehicle Detail' },
  { id: '9', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80&fit=crop', alt_text: 'Showroom Finish' },
]

export default function GalleryPage() {
  const { t } = useLanguage()
  const [images, setImages] = useState(DEMO_IMAGES)

  useEffect(() => {
    // Try to fetch from API, but fallback to demo images
    fetch('/api/gallery/list')
      .then(r => r.json())
      .then(data => {
        if (data.images && data.images.length > 0) {
          setImages(data.images)
        }
      })
      .catch(() => {
        // Keep demo images on error
      })
  }, [])

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', padding: '120px 24px 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#2a2a2a', marginBottom: 14 }}>{t.gallery.sectionLabel}</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12 }}>{t.gallery.heading}</h1>
            <p style={{ color: '#3a3a3a', fontSize: '0.9rem', lineHeight: 1.8 }}>{t.gallery.description}</p>
          </div>

          <GalleryGrid images={images} />

          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <a href="/booking" className="glow-btn glow-btn-green" style={{ padding: '14px 36px', fontSize: '0.9rem' }}>{t.gallery.bookYourDetail}</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
