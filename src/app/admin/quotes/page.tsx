'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  reviewed: '#f59e0b',
  quoted: '#22c55e',
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })

    setQuotes(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch('/api/quote', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })

    if (response.ok) {
      loadQuotes()
    }
  }

  const deleteQuote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote request?')) return

    const response = await fetch(`/api/quote?id=${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      loadQuotes()
    }
  }

  if (loading) {
    return <div style={{ color: '#888' }}>Loading...</div>
  }

  const newQuotes = quotes.filter(q => q.status === 'new')

  return (
    <div>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: 8 }}>Quote Requests</h1>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 40 }}>{newQuotes.length} new request{newQuotes.length !== 1 ? 's' : ''}</p>

      {quotes.length === 0 ? (
        <div style={{ color: '#888', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', padding: '48px 0' }}>No quote requests yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quotes.map(q => (
            <div key={q.id} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '20px 24px', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginBottom: 4 }}>{q.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{q.vehicle_year} {q.vehicle_make} {q.vehicle_model}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    value={q.status}
                    onChange={(e) => updateStatus(q.id, e.target.value)}
                    className="form-field"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.03)',
                      color: STATUS_COLORS[q.status] || '#666',
                      border: `1px solid ${STATUS_COLORS[q.status] || '#333'}30`,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="quoted">Quoted</option>
                  </select>
                  <button
                    onClick={() => deleteQuote(q.id)}
                    style={{
                      fontSize: '0.65rem',
                      padding: '3px 10px',
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, fontSize: '0.8rem', color: '#aaa' }}>
                <div><span style={{ color: '#777' }}>Service: </span>{q.service_requested}</div>
                <div><span style={{ color: '#777' }}>Phone: </span><a href={`tel:${q.phone}`} style={{ color: '#aaa' }}>{q.phone}</a></div>
                <div><span style={{ color: '#777' }}>Email: </span><a href={`mailto:${q.email}`} style={{ color: '#aaa' }}>{q.email}</a></div>
                <div><span style={{ color: '#777' }}>Address: </span>{q.address}</div>
              </div>
              {q.notes && <div style={{ marginTop: 12, fontSize: '0.8rem', color: '#888', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)' }}>{q.notes}</div>}
              <div style={{ marginTop: 10, fontSize: '0.7rem', color: '#666' }}>{new Date(q.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
