'use client'
import { useState, useEffect, useRef } from 'react'

type GalleryImage = { id: string; storage_path: string; alt_text?: string; category?: string; url?: string; created_at: string }

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [altText, setAltText] = useState('')
  const [category, setCategory] = useState<'gallery' | 'carousel'>('gallery')
  const [preview, setPreview] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchImages = async () => {
    const res = await fetch('/api/gallery/list')
    const data = await res.json()
    setImages(data.images || [])
  }

  useEffect(() => { fetchImages() }, [])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed.'); return }
    setPendingFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleUpload = async () => {
    if (!pendingFile) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', pendingFile)
    fd.append('alt_text', altText)
    fd.append('category', category)
    const res = await fetch('/api/gallery', { method: 'POST', body: fd })
    if (res.ok) {
      setPendingFile(null)
      setPreview(null)
      setAltText('')
      setCategory('gallery')
      await fetchImages()
    } else {
      const d = await res.json()
      setError(d.error || 'Upload failed')
    }
    setUploading(false)
  }

  const handleDelete = async (img: GalleryImage) => {
    if (!confirm('Delete this photo?')) return
    await fetch('/api/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: img.id, storage_path: img.storage_path }),
    })
    await fetchImages()
  }

  return (
    <div>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: 8 }}>Gallery</h1>
      <p style={{ color: '#333', fontSize: '0.85rem', marginBottom: 40 }}>Upload photos and assign them to the public gallery or the homepage carousel.</p>

      {/* Upload area */}
      <div style={{ marginBottom: 48 }}>
        {!preview ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `1px dashed ${dragOver ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10, padding: '60px 24px', textAlign: 'center', cursor: 'pointer',
              background: dragOver ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '1.5rem', color: '#2a2a2a', marginBottom: 12 }}>◆</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', color: '#333', marginBottom: 6 }}>Drop a photo here or click to browse</div>
            <div style={{ fontSize: '0.75rem', color: '#222' }}>JPG, PNG, WebP · Max 10MB</div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#333', marginBottom: 6 }}>Section *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['gallery', 'carousel'] as const).map(c => (
                    <button key={c} type="button" onClick={() => setCategory(c)} style={{
                      padding: '7px 16px', borderRadius: 6, border: '1px solid',
                      borderColor: category === c ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.07)',
                      background: category === c ? 'rgba(255,255,255,0.07)' : 'transparent',
                      color: category === c ? '#fff' : '#444',
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.78rem', fontWeight: 600,
                      cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
                    }}>{c}</button>
                  ))}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#222', marginTop: 6 }}>
                  {category === 'carousel' ? 'Shows in the homepage before/after carousel' : 'Shows in the public gallery page'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#333', marginBottom: 6 }}>Caption (optional)</label>
                <input className="form-field" value={altText} onChange={e => setAltText(e.target.value)} placeholder="e.g. 2022 BMW M3 — full detail" />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleUpload} disabled={uploading} className="glow-btn glow-btn-green" style={{ padding: '9px 20px', opacity: uploading ? 0.6 : 1 }}>
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
                <button onClick={() => { setPendingFile(null); setPreview(null) }} className="glow-btn" style={{ padding: '9px 20px' }}>Cancel</button>
              </div>
              {error && <div style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</div>}
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>

      {/* Image grid */}
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2a2a2a', marginBottom: 16 }}>
        {images.length} Photo{images.length !== 1 ? 's' : ''}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {images.map(img => (
          <div key={img.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: '#0a0a0a', aspectRatio: '4/3' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt_text || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <button
              onClick={() => handleDelete(img)}
              style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: '#666', fontSize: '0.7rem', padding: '3px 7px', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#666')}
            >✕</button>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 8px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.62rem', fontWeight: 600, padding: '2px 7px', borderRadius: 3, background: img.category === 'carousel' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)', color: img.category === 'carousel' ? '#22c55e' : '#3b82f6', border: `1px solid ${img.category === 'carousel' ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`, textTransform: 'capitalize', letterSpacing: '0.05em' }}>
                {img.category || 'gallery'}
              </span>
              {img.alt_text && <div style={{ fontSize: '0.7rem', color: '#888', marginTop: 4 }}>{img.alt_text}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
