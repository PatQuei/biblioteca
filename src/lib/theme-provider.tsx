'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (t: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
const STORAGE_KEY = 'theme-preference'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  const applyTheme = useCallback((t: Theme) => {
    const root = window.document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = t === 'dark' || (t === 'system' && prefersDark)

    if (isDark) {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
      setResolvedTheme('dark')
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
      setResolvedTheme('light')
    }
  }, [])

  // ler do localStorage (primeiro mount)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved) setThemeState(saved)
  }, [])

  // aplicar tema e persistir
  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') applyTheme('system')
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme, applyTheme])

  useEffect(() => {
    document.documentElement.classList.remove('notransition')
  }, [])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])

  return <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
