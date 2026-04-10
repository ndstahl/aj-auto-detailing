import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import GalleryGrid from '@/components/GalleryGrid'
import { createServiceClient } from '@/lib/supabase/server'

export const revalidate = 60

async function getImages() {
  try {
    const supabase = await createServiceClient()
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })

    if (!data || data.length === 0) return []

    const { data: { publicUrl: baseUrl } } = supabase.storage.from('gallery').getPublicUrl('')
    return data.map(img => ({ ...img, url: `${baseUrl}${img.storage_path}` }))
  } catch {
    return []
  }
}

export default async function GalleryPage() {
  const images = await getImages()

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', padding: '120px 24px 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#2a2a2a', marginBottom: 14 }}>— Our Work</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12 }}>Gallery</h1>
            <p style={{ color: '#3a3a3a', fontSize: '0.9rem', lineHeight: 1.8 }}>Real results from real cars. Every detail, done right.</p>
          </div>

          <GalleryGrid images={images} />

          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <a href="/booking" className="glow-btn glow-btn-green" style={{ padding: '14px 36px', fontSize: '0.9rem' }}>Book Your Detail</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
