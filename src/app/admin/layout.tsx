'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminNav from '@/components/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const checkUser = async () => {
      if (isLoginPage) {
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    }

    checkUser()
  }, [router, isLoginPage])

  if (loading && !isLoginPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: '#fff' }}>
        Loading...
      </div>
    )
  }

  // Login page gets no wrapper
  if (isLoginPage) {
    return <>{children}</>
  }

  // Protected pages get the admin nav
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <AdminNav />
      <main style={{ flex: 1, padding: '40px 32px', maxWidth: 1000 }}>
        {children}
      </main>
    </div>
  )
}
