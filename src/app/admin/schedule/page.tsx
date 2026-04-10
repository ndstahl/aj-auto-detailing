'use client'
import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format, isBefore, startOfDay } from 'date-fns'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DEFAULT_AVAILABILITY = DAYS.map((_, i) => ({
  day_of_week: i,
  start_time: '08:00',
  end_time: '17:00',
  slot_duration_minutes: 120,
  is_available: i >= 1 && i <= 6,
}))

type DayAvail = typeof DEFAULT_AVAILABILITY[0]

export default function SchedulePage() {
  const [availability, setAvailability] = useState<DayAvail[]>(DEFAULT_AVAILABILITY)
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        if (data.availability?.length) setAvailability(data.availability)
        if (data.blockedDates?.length) setBlockedDates(data.blockedDates.map((d: string) => new Date(d + 'T12:00:00')))
      })
  }, [])

  const toggleBlocked = (date: Date) => {
    const str = format(date, 'yyyy-MM-dd')
    setBlockedDates(prev => {
      const exists = prev.some(d => format(d, 'yyyy-MM-dd') === str)
      return exists ? prev.filter(d => format(d, 'yyyy-MM-dd') !== str) : [...prev, date]
    })
  }

  const updateDay = (idx: number, field: keyof DayAvail, value: string | boolean | number) => {
    setAvailability(prev => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d))
  }

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/schedule', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        availability,
        blockedDates: blockedDates.map(d => format(d, 'yyyy-MM-dd')),
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: 8 }}>Schedule</h1>
      <p style={{ color: '#333', fontSize: '0.85rem', marginBottom: 48 }}>Set your weekly hours and block off specific dates. Changes reflect immediately on the booking calendar.</p>

      {/* Weekly schedule */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2a2a2a', marginBottom: 20 }}>Weekly Hours</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
          {availability.map((day, i) => (
            <div key={day.day_of_week} style={{
              display: 'grid', gridTemplateColumns: '120px 60px 1fr',
              gap: 16, padding: '14px 20px', alignItems: 'center',
              borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
              opacity: day.is_available ? 1 : 0.4,
            }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', color: day.is_available ? '#fff' : '#333' }}>{DAYS[day.day_of_week]}</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={day.is_available}
                  onChange={e => updateDay(i, 'is_available', e.target.checked)}
                  style={{ accentColor: '#22c55e', width: 14, height: 14 }}
                />
              </label>
              {day.is_available && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#333', fontSize: '0.75rem' }}>From</span>
                    <input type="time" value={day.start_time} onChange={e => updateDay(i, 'start_time', e.target.value)}
                      className="form-field" style={{ width: 100, padding: '6px 10px', fontSize: '0.8rem' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#333', fontSize: '0.75rem' }}>To</span>
                    <input type="time" value={day.end_time} onChange={e => updateDay(i, 'end_time', e.target.value)}
                      className="form-field" style={{ width: 100, padding: '6px 10px', fontSize: '0.8rem' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#333', fontSize: '0.75rem' }}>Slot</span>
                    <select value={day.slot_duration_minutes} onChange={e => updateDay(i, 'slot_duration_minutes', Number(e.target.value))}
                      className="form-field" style={{ width: 110, padding: '6px 10px', fontSize: '0.8rem' }}>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                      <option value={180}>3 hours</option>
                      <option value={240}>4 hours</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blocked dates */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2a2a2a', marginBottom: 8 }}>Block Off Days</div>
        <p style={{ color: '#2a2a2a', fontSize: '0.8rem', marginBottom: 20 }}>Click a date to block it (vacation, personal days, etc.).</p>
        <div style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24, background: 'rgba(255,255,255,0.02)' }}>
          <DayPicker
            mode="multiple"
            selected={blockedDates}
            onSelect={(dates) => setBlockedDates(dates || [])}
            disabled={(date) => isBefore(date, startOfDay(new Date()))}
            fromMonth={new Date()}
            styles={{
              root: { fontFamily: "'Space Grotesk', sans-serif", color: '#666' },
              caption: { color: '#fff' },
              head_cell: { color: '#333', fontSize: '0.75rem' },
              day: { color: '#555', borderRadius: '6px' },
              day_selected: { background: 'rgba(239,68,68,0.3)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' },
              day_today: { color: '#fff', fontWeight: 700 },
              day_disabled: { color: '#1a1a1a' },
            }}
          />
        </div>
        {blockedDates.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {blockedDates.map(d => (
              <span key={format(d, 'yyyy-MM-dd')} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', padding: '4px 10px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4, color: '#ef4444', background: 'rgba(239,68,68,0.05)' }}>
                {format(d, 'MMM d')}
              </span>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={saving} className="glow-btn glow-btn-green" style={{ padding: '12px 32px', opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Schedule'}
      </button>
    </div>
  )
}
