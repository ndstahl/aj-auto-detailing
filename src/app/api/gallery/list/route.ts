import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServiceClient()
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })

    if (!data || data.length === 0) {
      return NextResponse.json({ images: [] })
    }

    const { data: { publicUrl: baseUrl } } = supabase.storage.from('gallery').getPublicUrl('')
    const images = data.map(img => ({ ...img, url: `${baseUrl}${img.storage_path}` }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({ images: [] })
  }
}
