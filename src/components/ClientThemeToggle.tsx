// src/components/ClientThemeToggle.tsx
'use client'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function ClientThemeToggle() {
  const [darkMode, setDarkMode] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Load dari localStorage dulu, lalu DB
    const saved = localStorage.getItem('theme')
    const isDark = saved === 'light' ? false : true
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    // Simpan ke DB (butuh user context, skip kalau gak ada)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', darkMode)
    // TODO: Update DB via supabase.from('user_profiles').update({ theme: darkMode ? 'dark' : 'light' })
  }, [darkMode])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
    >
      {darkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-cyan-300" />}
    </button>
  )
}