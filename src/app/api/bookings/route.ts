import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resend, AJ_EMAIL } from '@/lib/resend'
import { escapeHtml, isValidEmail } from '@/lib/sanitize'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, vehicle, service, date, time, notes } = body

  if (!name || !email || !phone || !vehicle || !service || !date || !time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  // Double-booking check
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('date', date)
    .eq('time', time)
    .neq('status', 'cancelled')
    .single()

  if (existing) {
    return NextResponse.json({ error: 'That time slot is no longer available. Please pick another.' }, { status: 409 })
  }

  // Insert booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({ name, email, phone, vehicle, service, date, time, notes: notes || null, status: 'pending' })
    .select()
    .single()

  if (error) {
    console.error('Booking insert error:', error)
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
  }

  // Email AJ - escape user input to prevent XSS
  await resend.emails.send({
    from: 'AJ Auto Detailing <bookings@ajautodetailing.com>',
    to: AJ_EMAIL,
    subject: `New Booking: ${escapeHtml(name)} — ${date} at ${time}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; color: #111;">
        <h2 style="margin-bottom: 4px;">New Booking Request</h2>
        <p style="color: #666; margin-bottom: 24px;">Someone just booked through your website.</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0; width: 120px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Date</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>${escapeHtml(date)}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Time</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>${escapeHtml(time)}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Service</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(service)}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Vehicle</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(vehicle)}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Phone</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(phone)}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; border-bottom: 1px solid #f0f0f0;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${escapeHtml(email)}</td></tr>
          ${notes ? `<tr><td style="padding: 8px 0; color: #888;">Notes</td><td style="padding: 8px 0;">${escapeHtml(notes)}</td></tr>` : ''}
        </table>
        <p style="margin-top: 24px; color: #aaa; font-size: 12px;">Booking ID: ${booking.id}</p>
      </div>
    `,
  }).catch(err => console.error('Email send error:', err))

  return NextResponse.json({ success: true, bookingId: booking.id })
}
