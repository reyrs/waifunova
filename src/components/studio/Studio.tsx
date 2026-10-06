'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignOutIcon } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase-client'
import { getWaifu, type Waifu } from '@/lib/waifus'
import { Wordmark } from '@/components/Wordmark'
import { ThemeControl } from '@/components/ThemeControl'
import { RosterRail } from './RosterRail'
import { ChatPanel } from './ChatPanel'
import { GeneratorPanel } from './GeneratorPanel'

// Owns the selected character so the rail and the chat always agree.
export function Studio({ userId, email }: { userId: string; email: string }) {
  const [waifu, setWaifu] = useState<Waifu>(getWaifu(null))
  const [profileLoaded, setProfileLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (userId === 'guest') {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('waifunova_favorite') : null
      if (saved) setWaifu(getWaifu(saved))
      setProfileLoaded(true)
      return
    }

    const supabase = createClient()
    let cancelled = false
    supabase
      .from('user_profiles')
      .select('favorite_waifu')
      .eq('id', userId)
      .maybeSingle()
      .then(
        ({ data }) => {
          if (cancelled) return
          if (data?.favorite_waifu) setWaifu(getWaifu(data.favorite_waifu))
          setProfileLoaded(true)
        },
        () => {
          if (!cancelled) setProfileLoaded(true)
        },
      )
    return () => {
      cancelled = true
    }
  }, [userId])

  const pick = (next: Waifu) => {
    setWaifu(next)
    if (userId === 'guest') {
      if (typeof window !== 'undefined') localStorage.setItem('waifunova_favorite', next.name)
      return
    }

    createClient()
      .from('user_profiles')
      .upsert({ id: userId, favorite_waifu: next.name, updated_at: new Date().toISOString() })
      .then(({ error }) => {
        if (error) console.error('Gagal menyimpan karakter favorit', error.message)
      })
  }

  const signOut = async () => {
    if (userId === 'guest') {
      router.push('/')
      return
    }
    await createClient().auth.signOut()
    router.replace('/')
    router.refresh()
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="mx-auto flex h-16 w-full max-w-[1400px] shrink-0 items-center justify-between gap-4 px-4 md:px-8">
        <Wordmark />
        <div className="flex items-center gap-3">
          {email && <span className="hidden max-w-[22ch] truncate text-sm text-muted md:block">{email}</span>}
          <ThemeControl id="studio-theme" />
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2 active:scale-[0.98]"
          >
            <SignOutIcon size={16} weight="bold" />
            <span className="hidden sm:inline">{userId === 'guest' ? 'Beranda' : 'Keluar'}</span>
          </button>
        </div>
      </header>

      <main
        id="konten"
        className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-6 px-4 pb-6 md:px-8 lg:grid-cols-[232px_minmax(0,1fr)_340px]"
      >
        <RosterRail current={waifu} onPick={pick} />
        {profileLoaded ? (
          <ChatPanel key={waifu.name} waifu={waifu} userId={userId} />
        ) : (
          <div className="skeleton h-[72dvh] rounded-[20px] lg:h-[calc(100dvh-5.5rem)]" aria-label="Memuat obrolan" />
        )}
        <GeneratorPanel />
      </main>
    </div>
  )
}
