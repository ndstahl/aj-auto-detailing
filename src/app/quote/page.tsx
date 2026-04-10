'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

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

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 35 }, (_, i) => CURRENT_YEAR - i)

export default function QuotePage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    vehicle_year: '', vehicle_make: '', vehicle_model: '',
    service_requested: '', notes: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Something went wrong')
      }
      setStatus('done')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#333', marginBottom: 6, letterSpacing: '0.05em' }
  const sectionHeadStyle: React.CSSProperties = { gridColumn: '1 / -1', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2a2a2a', paddingTop: 8 }

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', padding: '120px 24px 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>

          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#2a2a2a', marginBottom: 14 }}>— Pricing</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12 }}>Get a Free Quote</h1>
            <p style={{ color: '#3a3a3a', fontSize: '0.9rem', lineHeight: 1.8 }}>Fill out the form below and AJ will reach out with a custom price for your vehicle.</p>
          </div>

          {status === 'done' ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>✓</div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.8rem', marginBottom: 12 }}>Quote Request Sent!</h2>
              <p style={{ color: '#444', fontSize: '0.9rem', marginBottom: 36 }}>AJ will review your request and get back to you within 24 hours.</p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <a href="/" className="glow-btn glow-btn-blue">Back to Home</a>
                <a href="/booking" className="glow-btn glow-btn-green">Book Now</a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

                <div style={sectionHeadStyle}>Your Information</div>

                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input className="form-field" required value={form.name} onChange={set('name')} placeholder="John Smith" />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input className="form-field" required type="tel" value={form.phone} onChange={set('phone')} placeholder="(818) 555-0000" />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input className="form-field" required type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />
                </div>
                <div>
                  <label style={labelStyle}>Address *</label>
                  <input className="form-field" required value={form.address} onChange={set('address')} placeholder="123 Main St, San Fernando, CA" />
                </div>

                <div style={sectionHeadStyle}>Vehicle Information</div>

                <div>
                  <label style={labelStyle}>Year *</label>
                  <select className="form-field" required value={form.vehicle_year} onChange={set('vehicle_year')}>
                    <option value="">Select year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Make *</label>
                  <input className="form-field" required value={form.vehicle_make} onChange={set('vehicle_make')} placeholder="Toyota" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Model *</label>
                  <input className="form-field" required value={form.vehicle_model} onChange={set('vehicle_model')} placeholder="Camry SE" />
                </div>

                <div style={sectionHeadStyle}>Service Details</div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Service Requested *</label>
                  <select className="form-field" required value={form.service_requested} onChange={set('service_requested')}>
                    <option value="">Select a service</option>
                    {SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Additional Notes</label>
                  <textarea className="form-field" rows={4} value={form.notes} onChange={set('notes')} placeholder="Describe any specific concerns, damage, or requests..." style={{ resize: 'vertical' }} />
                </div>

                {status === 'error' && (
                  <div style={{ gridColumn: '1 / -1', color: '#ef4444', fontSize: '0.875rem', padding: '12px 16px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, background: 'rgba(239,68,68,0.05)' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ gridColumn: '1 / -1', paddingTop: 8 }}>
                  <button type="submit" disabled={status === 'submitting'} className="glow-btn glow-btn-green" style={{ padding: '14px 36px', fontSize: '0.9rem', opacity: status === 'submitting' ? 0.6 : 1 }}>
                    {status === 'submitting' ? 'Sending…' : 'Request Quote'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
