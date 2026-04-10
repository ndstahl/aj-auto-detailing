'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import translations_en from './translations/en'
import translations_es from './translations/es'
import type { Translations } from './types'

type Language = 'en' | 'es'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  // Load preference from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('preferred-language')
    if (saved === 'en' || saved === 'es') {
      setLang(saved)
    }
  }, [])

  // Persist preference to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('preferred-language', lang)
    }
  }, [lang, mounted])

  const t = lang === 'en' ? translations_en : translations_es

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
