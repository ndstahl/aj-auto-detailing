'use client'
import { useLanguage } from '@/lib/i18n/context'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      fontSize: '0.75rem',
    }}>
      <button
        onClick={() => setLang('en')}
        style={{
          background: 'none',
          border: 'none',
          color: lang === 'en' ? '#fff' : '#888',
          fontWeight: lang === 'en' ? 600 : 400,
          cursor: 'pointer',
          padding: 0,
          transition: 'color 0.2s',
        }}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span style={{ color: '#444' }}>|</span>
      <button
        onClick={() => setLang('es')}
        style={{
          background: 'none',
          border: 'none',
          color: lang === 'es' ? '#fff' : '#888',
          fontWeight: lang === 'es' ? 600 : 400,
          cursor: 'pointer',
          padding: 0,
          transition: 'color 0.2s',
        }}
        aria-label="Cambiar a español"
      >
        ES
      </button>
    </div>
  )
}
