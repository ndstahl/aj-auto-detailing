'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/i18n/context'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 35 }, (_, i) => CURRENT_YEAR - i)

export default function QuotePage() {
  const { t } = useLanguage()
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

  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#888', marginBottom: 6, letterSpacing: '0.05em' }
  const sectionHeadStyle: React.CSSProperties = { gridColumn: '1 / -1', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa', paddingTop: 8 }

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', padding: '120px 24px 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>

          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#aaa', marginBottom: 14 }}>{t.quote.sectionLabel}</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12 }}>{t.quote.heading}</h1>
            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.8 }}>{t.quote.description}</p>
          </div>

          {status === 'done' ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>✓</div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.8rem', marginBottom: 12 }}>{t.quote.successHeading}</h2>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 36 }}>{t.quote.successMessage}</p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <a href="/" className="glow-btn glow-btn-blue">{t.quote.backToHome}</a>
                <a href="/booking" className="glow-btn glow-btn-green">{t.quote.bookNow}</a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

                <div style={sectionHeadStyle}>{t.quote.yourInformation}</div>

                <div>
                  <label style={labelStyle}>{t.quote.fullName} *</label>
                  <input className="form-field" required value={form.name} onChange={set('name')} placeholder="John Smith" />
                </div>
                <div>
                  <label style={labelStyle}>{t.quote.phoneNumber} *</label>
                  <input className="form-field" required type="tel" value={form.phone} onChange={set('phone')} placeholder="(818) 555-0000" />
                </div>
                <div>
                  <label style={labelStyle}>{t.quote.email} *</label>
                  <input className="form-field" required type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />
                </div>
                <div>
                  <label style={labelStyle}>{t.quote.address} *</label>
                  <input className="form-field" required value={form.address} onChange={set('address')} placeholder="123 Main St, San Fernando, CA" />
                </div>

                <div style={sectionHeadStyle}>{t.quote.vehicleInformation}</div>

                <div>
                  <label style={labelStyle}>{t.quote.year} *</label>
                  <select className="form-field" required value={form.vehicle_year} onChange={set('vehicle_year')}>
                    <option value="">{t.quote.selectYear}</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>{t.quote.make} *</label>
                  <input className="form-field" required value={form.vehicle_make} onChange={set('vehicle_make')} placeholder="Toyota" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>{t.quote.model} *</label>
                  <input className="form-field" required value={form.vehicle_model} onChange={set('vehicle_model')} placeholder="Camry SE" />
                </div>

                <div style={sectionHeadStyle}>{t.quote.serviceDetails}</div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>{t.quote.serviceRequested} *</label>
                  <select className="form-field" required value={form.service_requested} onChange={set('service_requested')}>
                    <option value="">{t.quote.selectService}</option>
                    {t.quote.services.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>{t.quote.additionalNotes}</label>
                  <textarea className="form-field" rows={4} value={form.notes} onChange={set('notes')} placeholder={t.quote.notesPlaceholder} style={{ resize: 'vertical' }} />
                </div>

                {status === 'error' && (
                  <div style={{ gridColumn: '1 / -1', color: '#ef4444', fontSize: '0.875rem', padding: '12px 16px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, background: 'rgba(239,68,68,0.05)' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ gridColumn: '1 / -1', paddingTop: 8 }}>
                  <button type="submit" disabled={status === 'submitting'} className="glow-btn glow-btn-green" style={{ padding: '14px 36px', fontSize: '0.9rem', opacity: status === 'submitting' ? 0.6 : 1 }}>
                    {status === 'submitting' ? t.quote.sending : t.quote.requestQuote}
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
