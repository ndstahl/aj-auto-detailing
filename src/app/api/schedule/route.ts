import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServiceClient()

  const [{ data: avail }, { data: blocked }] = await Promise.all([
    supabase.from('availability').select('*').order('day_of_week'),
    supabase.from('blocked_dates').select('date').gte('date', new Date().toISOString().split('T')[0]),
  ])

  const disabledWeekdays = [0, 1, 2, 3, 4, 5, 6].filter(
    d => !avail?.some(a => a.day_of_week === d && a.is_available)
  )

  return NextResponse.json({
    availability: avail || [],
    blockedDates: (blocked || []).map(b => b.date),
    disabledWeekdays,
  })
}

export async function PUT(req: NextRequest) {
  const supabase = await createServiceClient()
  const { availability, blockedDates } = await req.json()

  if (availability) {
    for (const row of availability) {
      await supabase
        .from('availability')
        .upsert({ day_of_week: row.day_of_week, start_time: row.start_time, end_time: row.end_time, slot_duration_minutes: row.slot_duration_minutes, is_available: row.is_available }, { onConflict: 'day_of_week' })
    }
  }

  if (blockedDates) {
    // Replace future blocked dates
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('blocked_dates').delete().gte('date', today)
    if (blockedDates.length > 0) {
      await supabase.from('blocked_dates').insert(blockedDates.map((date: string) => ({ date })))
    }
  }

  return NextResponse.json({ success: true })
}
