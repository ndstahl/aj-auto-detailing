'use client'

type GalleryImage = { id: string; url: string; alt_text?: string }

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#2a2a2a', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem' }}>
        Photos coming soon.
      </div>
    )
  }

  return (
    <div style={{ columns: 3, columnGap: 12 }}>
      {images.map(img => (
        <div key={img.id} style={{ breakInside: 'avoid', marginBottom: 12, overflow: 'hidden', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', background: '#0a0a0a' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt_text || 'AJ Auto Detailing'}
            style={{ width: '100%', display: 'block', transition: 'transform 0.4s', cursor: 'pointer' }}
            loading="lazy"
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      ))}
    </div>
  )
}
