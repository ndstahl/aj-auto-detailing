'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#22c55e',
  cancelled: '#333',
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    setBookings(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })

    if (response.ok) {
      loadBookings()
    }
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    const response = await fetch(`/api/bookings?id=${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      loadBookings()
    }
  }

  if (loading) {
    return <div style={{ color: '#888' }}>Loading...</div>
  }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = bookings.filter(b => b.date >= today && b.status !== 'cancelled')
  const past = bookings.filter(b => b.date < today || b.status === 'cancelled')

  return (
    <div>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: 8 }}>Bookings</h1>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 40 }}>{upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''}</p>

      <BookingTable title="Upcoming" bookings={upcoming} onUpdateStatus={updateStatus} onDelete={deleteBooking} />
      {past.length > 0 && <BookingTable title="Past & Cancelled" bookings={past} onUpdateStatus={updateStatus} onDelete={deleteBooking} muted />}
    </div>
  )
}

function BookingTable({ title, bookings, onUpdateStatus, onDelete, muted }: {
  title: string;
  bookings: any[];
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  muted?: boolean
}) {
  if (bookings.length === 0) return null
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>{title}</div>
      <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
        {bookings.map((b, i) => (
          <div key={b.id} style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px 120px 90px',
            gap: 12, padding: '16px 20px', alignItems: 'center',
            borderBottom: i < bookings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
            opacity: muted ? 0.5 : 1,
          }}>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{b.date}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#888' }}>{b.time}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', color: '#ccc' }}>{b.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>{b.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{b.service}</div>
              <div style={{ fontSize: '0.75rem', color: '#777' }}>{b.vehicle}</div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888', wordBreak: 'break-all' }}>{b.email}</div>
            <div>
              <select
                value={b.status}
                onChange={(e) => onUpdateStatus(b.id, e.target.value)}
                className="form-field"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.04)',
                  color: STATUS_COLORS[b.status] || '#666',
                  border: `1px solid ${STATUS_COLORS[b.status] || '#333'}30`,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => onDelete(b.id)}
                style={{
                  fontSize: '0.7rem',
                  padding: '4px 10px',
                  borderRadius: 4,
                  background: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
