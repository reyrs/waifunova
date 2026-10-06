'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { CircleNotchIcon, EnvelopeSimpleIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase-client'

type Mode = 'login' | 'signup'

const COPY = {
  login: { title: 'Masuk lagi.', sub: 'Lanjutkan obrolan yang kemarin.', submit: 'Masuk' },
  signup: { title: 'Bikin akun.', sub: 'Cuma butuh email dan password.', submit: 'Daftar' },
}

function translateError(message: string) {
  if (/invalid login credentials/i.test(message)) return 'Email atau password salah.'
  if (/email not confirmed/i.test(message)) return 'Email belum diverifikasi. Cek kotak masuk kamu.'
  if (/already registered/i.test(message)) return 'Email ini sudah terdaftar. Coba masuk.'
  if (/password should be at least/i.test(message)) return 'Password minimal 6 karakter.'
  return 'Gagal terhubung. Coba lagi sebentar.'
}

export function AuthForm({ next, callbackError }: { next: string; callbackError: boolean }) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    callbackError ? 'Link verifikasi nggak valid atau sudah kedaluwarsa.' : null,
  )
  const [sentTo, setSentTo] = useState<string | null>(null)
  const router = useRouter()

  const switchMode = (m: Mode) => {
    setMode(m)
    setError(null)
    setSentTo(null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.replace(next)
        router.refresh()
        return
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })
      if (error) throw error
      setSentTo(email)
    } catch (err) {
      setError(translateError(err instanceof Error ? err.message : ''))
    } finally {
      setLoading(false)
    }
  }

  const copy = COPY[mode]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm"
    >
      <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">{copy.title}</h1>
      <p className="mt-3 text-muted">{copy.sub}</p>

      <div role="tablist" aria-label="Pilih mode" className="mt-8 grid grid-cols-2 rounded-full border border-line bg-surface p-1">
        {(['login', 'signup'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className="relative rounded-full py-2 text-sm font-medium text-muted transition-colors aria-selected:text-ink"
          >
            {mode === m && (
              <motion.span
                layoutId="auth-mode"
                className="absolute inset-0 rounded-full bg-surface-2"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative">{m === 'login' ? 'Masuk' : 'Daftar'}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {sentTo ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-8 rounded-[20px] border border-line bg-surface p-6"
            role="status"
          >
            <EnvelopeSimpleIcon size={28} className="text-accent" />
            <p className="mt-4 font-semibold">Cek email kamu.</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Link verifikasi sudah dikirim ke <span className="font-medium text-ink">{sentTo}</span>. Kalau nggak ada, cek
              folder spam.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-full border border-line bg-surface px-5 text-ink outline-none transition-shadow placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                aria-describedby="password-hint"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-full border border-line bg-surface px-5 text-ink outline-none transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <p id="password-hint" className="text-sm text-muted">
                Minimal 6 karakter.
              </p>
            </div>

            {error && (
              <p role="alert" className="flex items-start gap-2 text-sm text-accent">
                <WarningCircleIcon size={18} weight="bold" className="mt-px shrink-0" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-accent font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-60"
            >
              {loading && <CircleNotchIcon size={18} weight="bold" className="animate-spin" />}
              {copy.submit}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
