'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const LINKS = [
  { href: '/admin', label: 'Bookings', icon: '◈' },
  { href: '/admin/schedule', label: 'Schedule', icon: '◉' },
  { href: '/admin/gallery', label: 'Gallery', icon: '◆' },
  { href: '/admin/quotes', label: 'Quotes', icon: '✦' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside style={{ width: 200, borderRight: '1px solid rgba(255,255,255,0.05)', padding: '32px 0', display: 'flex', flexDirection: 'column', background: '#050505', flexShrink: 0, minHeight: '100vh', position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ padding: '0 20px', marginBottom: 40 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', color: '#fff', marginBottom: 2 }}>AJ AUTO</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.6rem', letterSpacing: '0.25em', color: '#222', textTransform: 'uppercase' }}>Admin</div>
      </div>

      <nav style={{ flex: 1 }}>
        {LINKS.map(l => {
          const active = pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href))
          return (
            <Link key={l.href} href={l.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8rem', fontWeight: 500,
              color: active ? '#fff' : '#333',
              background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
              borderRight: active ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
              transition: 'all 0.2s', letterSpacing: '0.03em',
              textDecoration: 'none',
            }}>
              <span style={{ fontSize: '0.7rem', color: active ? '#fff' : '#2a2a2a' }}>{l.icon}</span>
              {l.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 20px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20 }}>
        <Link href="/" style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#222', marginBottom: 12, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#555')}
          onMouseLeave={e => (e.currentTarget.style.color = '#222')}
        >← View Site</Link>
        <button onClick={handleSignOut} style={{ background: 'none', border: 'none', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: '#222', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#555')}
          onMouseLeave={e => (e.currentTarget.style.color = '#222')}
        >Sign Out</button>
      </div>
    </aside>
  )
}
