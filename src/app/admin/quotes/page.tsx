import { createServiceClient } from '@/lib/supabase/server'

const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  reviewed: '#f59e0b',
  quoted: '#22c55e',
}

export default async function AdminQuotesPage() {
  const supabase = await createServiceClient()
  const { data: quotes } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: 8 }}>Quote Requests</h1>
      <p style={{ color: '#333', fontSize: '0.85rem', marginBottom: 40 }}>{(quotes || []).filter(q => q.status === 'new').length} new request{(quotes || []).filter(q => q.status === 'new').length !== 1 ? 's' : ''}</p>

      {!quotes || quotes.length === 0 ? (
        <div style={{ color: '#2a2a2a', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', padding: '48px 0' }}>No quote requests yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quotes.map(q => (
            <div key={q.id} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '20px 24px', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginBottom: 4 }}>{q.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#333' }}>{q.vehicle_year} {q.vehicle_make} {q.vehicle_model}</div>
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.65rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.03)', color: STATUS_COLORS[q.status] || '#666', border: `1px solid ${STATUS_COLORS[q.status] || '#333'}30`, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {q.status}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, fontSize: '0.8rem', color: '#444' }}>
                <div><span style={{ color: '#2a2a2a' }}>Service: </span>{q.service_requested}</div>
                <div><span style={{ color: '#2a2a2a' }}>Phone: </span><a href={`tel:${q.phone}`} style={{ color: '#444' }}>{q.phone}</a></div>
                <div><span style={{ color: '#2a2a2a' }}>Email: </span><a href={`mailto:${q.email}`} style={{ color: '#444' }}>{q.email}</a></div>
                <div><span style={{ color: '#2a2a2a' }}>Address: </span>{q.address}</div>
              </div>
              {q.notes && <div style={{ marginTop: 12, fontSize: '0.8rem', color: '#333', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)' }}>{q.notes}</div>}
              <div style={{ marginTop: 10, fontSize: '0.7rem', color: '#1e1e1e' }}>{new Date(q.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
