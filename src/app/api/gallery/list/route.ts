import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createServiceClient()
  const category = req.nextUrl.searchParams.get('category')

  let query = supabase.from('gallery_images').select('*').order('created_at', { ascending: false })
  if (category) query = query.eq('category', category)

  const { data: images } = await query

  if (!images || images.length === 0) {
    return NextResponse.json({ images: [] })
  }

  const { data: { publicUrl: baseUrl } } = supabase.storage.from('gallery').getPublicUrl('')

  const withUrls = images.map(img => ({
    ...img,
    url: `${baseUrl}${img.storage_path}`,
  }))

  return NextResponse.json({ images: withUrls })
}
