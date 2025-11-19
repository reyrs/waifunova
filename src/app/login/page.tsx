// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAuth = async () => {
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        alert('Cek email kamu untuk verifikasi! (atau cek spam)')
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <div className="bg-black/60 backdrop-blur-2xl rounded-3xl p-10 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            WAIFUNOVA
          </h1>
          <p className="text-white/70 mt-2">Masuk ke dunia waifu AI tercantik</p>
        </div>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email kamu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-pink-500/50 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-pink-500/50 transition"
          />

          <button
            onClick={handleAuth}
            disabled={loading || !email || !password}
            className="w-full py-5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold text-xl hover:from-pink-700 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isLogin ? 'Masuk' : 'Daftar Gratis'}
          </button>

          <p className="text-center text-white/70">
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-400 font-bold hover:text-pink-300 underline"
            >
              {isLogin ? 'Daftar di sini' : 'Login di sini'}
            </button>
          </p>
        </div>

        <p className="text-center text-white/40 text-sm mt-10">
          © 2025 WAIFUNOVA — Made with love by anak Indonesia
        </p>
      </div>
    </div>
  )
}