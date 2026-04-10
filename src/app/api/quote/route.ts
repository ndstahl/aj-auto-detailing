import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resend, AJ_EMAIL } from '@/lib/resend'
import { escapeHtml, isValidEmail } from '@/lib/sanitize'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, address, vehicle_year, vehicle_make, vehicle_model, service_requested, notes } = body

  if (!name || !email || !phone || !address || !vehicle_year || !vehicle_make || !vehicle_model || !service_requested) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { data: quote, error } = await supabase
    .from('quote_requests')
    .insert({ name, email, phone, address, vehicle_year, vehicle_make, vehicle_model, service_requested, notes: notes || null, status: 'new' })
    .select()
    .single()

  if (error) {
    console.error('Quote insert error:', error)
    return NextResponse.json({ error: 'Failed to save quote request' }, { status: 500 })
  }

  // Email AJ - escape user input to prevent XSS
  await resend.emails.send({
    from: 'AJ Auto Detailing <quotes@ajautodetailing.com>',
    to: AJ_EMAIL,
    subject: `Quote Request: ${escapeHtml(name)} — ${escapeHtml(vehicle_year)} ${escapeHtml(vehicle_make)} ${escapeHtml(vehicle_model)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; color: #111;">
        <h2 style="margin-bottom: 4px;">New Quote Request</h2>
        <p style="color: #666; margin-bottom: 24px;">A customer is looking for a quote.</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0; width: 140px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Phone</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(phone)}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(email)}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Address</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(address)}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Vehicle</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>${escapeHtml(vehicle_year)} ${escapeHtml(vehicle_make)} ${escapeHtml(vehicle_model)}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Service</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(service_requested)}</td></tr>
          ${notes ? `<tr><td style="padding: 8px 0; color: #888;">Notes</td><td style="padding: 8px 0;">${escapeHtml(notes)}</td></tr>` : ''}
        </table>
        <p style="margin-top: 24px; color: #aaa; font-size: 12px;">Quote ID: ${quote.id}</p>
      </div>
    `,
  }).catch(err => console.error('Email send error:', err))

  return NextResponse.json({ success: true, quoteId: quote.id })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, status } = body

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
  }

  if (!['new', 'reviewed', 'quoted'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('quote_requests')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Quote update error:', error)
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('quote_requests')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Quote delete error:', error)
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
