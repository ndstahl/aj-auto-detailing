'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em', marginBottom: 4 }}>AJ AUTO DETAILING</div>
          <div style={{ color: '#333', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Admin Portal</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#333', marginBottom: 6, letterSpacing: '0.05em' }}>Email</label>
            <input className="form-field" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#333', marginBottom: 6, letterSpacing: '0.05em' }}>Password</label>
            <input className="form-field" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', padding: '10px 14px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, background: 'rgba(239,68,68,0.05)' }}>{error}</div>}
          <button type="submit" disabled={loading} className="glow-btn glow-btn-green" style={{ marginTop: 8, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
