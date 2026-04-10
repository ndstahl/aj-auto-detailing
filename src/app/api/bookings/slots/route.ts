import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

function generateSlots(startTime: string, endTime: string, durationMin: number): string[] {
  const slots: string[] = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  let current = startH * 60 + startM
  const end = endH * 60 + endM
  while (current + durationMin <= end) {
    const h = Math.floor(current / 60)
    const m = current % 60
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
    slots.push(`${hour}:${m.toString().padStart(2, '0')} ${ampm}`)
    current += durationMin
  }
  return slots
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const dayOfWeek = new Date(date + 'T12:00:00').getDay()

  // Check if day is available — fall back to default Mon–Sat 8AM–5PM if table is empty
  const DEFAULT_AVAIL = { start_time: '08:00', end_time: '17:00', slot_duration_minutes: 120 }
  let avail: typeof DEFAULT_AVAIL | null = null

  const { data: dbAvail } = await supabase
    .from('availability')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .eq('is_available', true)
    .single()

  if (dbAvail) {
    avail = dbAvail
  } else {
    // Check if ANY availability rows exist; if none, use defaults for Mon–Sat
    const { data: anyRows } = await supabase.from('availability').select('id').limit(1)
    if (!anyRows || anyRows.length === 0) {
      // No schedule configured yet — use default Mon–Sat
      if (dayOfWeek >= 1 && dayOfWeek <= 6) {
        avail = DEFAULT_AVAIL
      }
    }
  }

  if (!avail) {
    return NextResponse.json({ slots: [] })
  }

  // Check for blocked date
  const { data: blocked } = await supabase
    .from('blocked_dates')
    .select('id')
    .eq('date', date)
    .single()

  if (blocked) {
    return NextResponse.json({ slots: [] })
  }

  // Get existing bookings for that date
  const { data: existing } = await supabase
    .from('bookings')
    .select('time')
    .eq('date', date)
    .neq('status', 'cancelled')

  const bookedTimes = new Set((existing || []).map(b => b.time))
  const allSlots = generateSlots(avail.start_time, avail.end_time, avail.slot_duration_minutes)

  const slots = allSlots.map(time => ({
    time,
    available: !bookedTimes.has(time),
  }))

  return NextResponse.json({ slots })
}
