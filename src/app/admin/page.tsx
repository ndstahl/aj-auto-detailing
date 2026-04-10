import { createServiceClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#22c55e',
  cancelled: '#333',
}

export default async function AdminBookingsPage() {
  const supabase = await createServiceClient()
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  const today = new Date().toISOString().split('T')[0]
  const upcoming = (bookings || []).filter(b => b.date >= today && b.status !== 'cancelled')
  const past = (bookings || []).filter(b => b.date < today || b.status === 'cancelled')

  return (
    <div>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: 8 }}>Bookings</h1>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 40 }}>{upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''}</p>

      <BookingTable title="Upcoming" bookings={upcoming} />
      {past.length > 0 && <BookingTable title="Past & Cancelled" bookings={past} muted />}
    </div>
  )
}

function BookingTable({ title, bookings, muted }: { title: string; bookings: any[]; muted?: boolean }) {
  if (bookings.length === 0) return null
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>{title}</div>
      <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
        {bookings.map((b, i) => (
          <div key={b.id} style={{
            display: 'grid', gridTemplateColumns: '140px 1fr 1fr 120px 80px',
            gap: 16, padding: '16px 20px', alignItems: 'center',
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
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: STATUS_COLORS[b.status] || '#666', border: `1px solid ${STATUS_COLORS[b.status] || '#333'}30`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
