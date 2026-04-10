import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resend, AJ_EMAIL } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, address, vehicle_year, vehicle_make, vehicle_model, service_requested, notes } = body

  if (!name || !email || !phone || !address || !vehicle_year || !vehicle_make || !vehicle_model || !service_requested) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

  // Email AJ
  await resend.emails.send({
    from: 'AJ Auto Detailing <quotes@ajautodetailing.com>',
    to: AJ_EMAIL,
    subject: `Quote Request: ${name} — ${vehicle_year} ${vehicle_make} ${vehicle_model}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; color: #111;">
        <h2 style="margin-bottom: 4px;">New Quote Request</h2>
        <p style="color: #666; margin-bottom: 24px;">A customer is looking for a quote.</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0; width: 140px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Phone</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${email}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Address</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${address}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Vehicle</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>${vehicle_year} ${vehicle_make} ${vehicle_model}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Service</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${service_requested}</td></tr>
          ${notes ? `<tr><td style="padding: 8px 0; color: #888;">Notes</td><td style="padding: 8px 0;">${notes}</td></tr>` : ''}
        </table>
        <p style="margin-top: 24px; color: #aaa; font-size: 12px;">Quote ID: ${quote.id}</p>
      </div>
    `,
  }).catch(err => console.error('Email send error:', err))

  return NextResponse.json({ success: true, quoteId: quote.id })
}
