import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient()
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const altText = formData.get('alt_text') as string || ''
  const category = (formData.get('category') as string) || 'gallery'
  const validCategories = ['gallery', 'carousel']
  const safeCategory = validCategories.includes(category) ? category : 'gallery'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPG, PNG, WebP, or GIF.' }, { status: 400 })
  }

  // Limit file size to 10MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { error: dbError } = await supabase
    .from('gallery_images')
    .insert({ storage_path: path, alt_text: altText || null, category: safeCategory })

  if (dbError) {
    await supabase.storage.from('gallery').remove([path])
    return NextResponse.json({ error: 'Failed to save image record' }, { status: 500 })
  }

  return NextResponse.json({ success: true, path })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServiceClient()
  const { id, storage_path } = await req.json()

  if (!id || !storage_path) {
    return NextResponse.json({ error: 'Missing id or storage_path' }, { status: 400 })
  }

  await supabase.storage.from('gallery').remove([storage_path])
  await supabase.from('gallery_images').delete().eq('id', id)

  return NextResponse.json({ success: true })
}
