'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format, isBefore, startOfDay, addMonths } from 'date-fns'

const SERVICES = [
  'Express Wash & Vacuum',
  'Interior Detail',
  'Exterior Wash & Polish',
  'Full Detail (Interior + Exterior)',
  'Paint Correction',
  'Ceramic Coating',
  'Engine Bay Clean',
  'Other / Custom',
]

type TimeSlot = { time: string; available: boolean }

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  const [disabledWeekdays, setDisabledWeekdays] = useState<number[]>([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicle: '', service: '', notes: '' })
  const [step, setStep] = useState<'calendar' | 'details' | 'done'>('calendar')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load schedule config
  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        if (data.disabledWeekdays) setDisabledWeekdays(data.disabledWeekdays)
        if (data.blockedDates) setBlockedDates(data.blockedDates.map((d: string) => new Date(d)))
      })
      .catch(() => {})
  }, [])

  // Load slots when date selected
  useEffect(() => {
    if (!selectedDate) return
    setLoadingSlots(true)
    setSelectedTime('')
    setSlots([])
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    fetch(`/api/bookings/slots?date=${dateStr}`)
      .then(r => r.json())
      .then(data => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [selectedDate])

  const isDisabled = (date: Date) => {
    if (isBefore(date, startOfDay(new Date()))) return true
    if (disabledWeekdays.includes(date.getDay())) return true
    if (blockedDates.some(b => format(b, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))) return true
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: format(selectedDate, 'yyyy-MM-dd'), time: selectedTime }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Something went wrong')
      }
      setStep('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', padding: '120px 24px 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 14 }}>— Schedule</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12 }}>Book an Appointment</h1>
            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.8 }}>Pick a date, choose a time, and we'll take it from there.</p>
          </div>

          {step === 'done' ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>✓</div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.8rem', marginBottom: 12 }}>You're Booked!</h2>
              <p style={{ color: '#888', marginBottom: 8 }}>
                <strong style={{ color: '#fff' }}>{format(selectedDate!, 'EEEE, MMMM d, yyyy')}</strong> at <strong style={{ color: '#fff' }}>{selectedTime}</strong>
              </p>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 36 }}>AJ will be in touch to confirm your appointment. Check your email for details.</p>
              <a href="/" className="glow-btn glow-btn-green">Back to Home</a>
            </div>
          ) : step === 'calendar' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 48, alignItems: 'start' }}>
              {/* Calendar */}
              <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDisabled}
                  fromMonth={new Date()}
                  toMonth={addMonths(new Date(), 3)}
                  styles={{
                    root: { fontFamily: "'Space Grotesk', sans-serif", color: '#aaa' },
                    caption: { color: '#fff' },
                    head_cell: { color: '#777', fontSize: '0.75rem' },
                    day: { color: '#aaa', borderRadius: '6px' },
                    day_selected: { background: '#fff', color: '#080808' },
                    day_today: { color: '#fff', fontWeight: 700 },
                    day_disabled: { color: '#444' },
                    nav_button: { color: '#888' },
                  }}
                />
              </div>

              {/* Time slots */}
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#aaa', marginBottom: 20 }}>
                  {selectedDate ? `Available Times — ${format(selectedDate, 'MMM d')}` : 'Select a date to see times'}
                </div>

                {loadingSlots && (
                  <div style={{ color: '#777', fontSize: '0.875rem' }}>Loading slots…</div>
                )}

                {!loadingSlots && selectedDate && slots.length === 0 && (
                  <div style={{ color: '#777', fontSize: '0.875rem', padding: '20px 0' }}>No available slots for this day.</div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                  {slots.map(s => (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => setSelectedTime(s.time)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 6,
                        border: selectedTime === s.time ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.06)',
                        background: selectedTime === s.time ? 'rgba(255,255,255,0.08)' : s.available ? 'rgba(255,255,255,0.02)' : 'transparent',
                        color: !s.available ? '#555' : selectedTime === s.time ? '#fff' : '#aaa',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        cursor: s.available ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        textDecoration: !s.available ? 'line-through' : 'none',
                      }}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>

                {selectedDate && selectedTime && (
                  <button
                    onClick={() => setStep('details')}
                    className="glow-btn glow-btn-green"
                    style={{ marginTop: 32, padding: '12px 28px' }}
                  >
                    Continue →
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Details form */
            <div>
              <button
                onClick={() => setStep('calendar')}
                style={{ background: 'none', border: 'none', color: '#aaa', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8rem', cursor: 'pointer', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
              >
                ← {format(selectedDate!, 'MMM d')} at {selectedTime}
              </button>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Your Info</div>

                <div>
                  <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#888', marginBottom: 6, letterSpacing: '0.05em' }}>Full Name *</label>
                  <input className="form-field" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#888', marginBottom: 6, letterSpacing: '0.05em' }}>Email *</label>
                  <input className="form-field" required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#888', marginBottom: 6, letterSpacing: '0.05em' }}>Phone *</label>
                  <input className="form-field" required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(818) 555-0000" />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#888', marginBottom: 6, letterSpacing: '0.05em' }}>Vehicle *</label>
                  <input className="form-field" required value={form.vehicle} onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))} placeholder="2021 Toyota Camry" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#888', marginBottom: 6, letterSpacing: '0.05em' }}>Service *</label>
                  <select className="form-field" required value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                    <option value="">Select a service</option>
                    {SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#888', marginBottom: 6, letterSpacing: '0.05em' }}>Notes</label>
                  <textarea className="form-field" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any specific concerns or requests?" style={{ resize: 'vertical' }} />
                </div>

                {error && <div style={{ gridColumn: '1 / -1', color: '#ef4444', fontSize: '0.875rem', padding: '12px 16px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, background: 'rgba(239,68,68,0.05)' }}>{error}</div>}

                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" disabled={submitting} className="glow-btn glow-btn-green" style={{ padding: '14px 36px', fontSize: '0.9rem', opacity: submitting ? 0.6 : 1 }}>
                    {submitting ? 'Booking…' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
