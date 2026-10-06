'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowClockwiseIcon, PaperPlaneRightIcon } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase-client'
import type { Waifu } from '@/lib/waifus'
import { MessageBubble, TypingDots } from './MessageBubble'

type Message = { id: string; from: 'user' | 'waifu'; text: string }
type Status = 'loading' | 'ready' | 'error'

export function ChatPanel({ waifu, userId }: { waifu: Waifu; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [saveError, setSaveError] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const replyTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const lastReply = useRef<string | null>(null)

  const fetchHistory = useCallback(async () => {
    if (userId === 'guest') {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`waifunova_chat_${waifu.name}`)
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as { id: string; message: string; reply: string }[]
            return { data: parsed, error: null }
          } catch {}
        }
      }
      return { data: [], error: null }
    }

    return createClient()
      .from('chat_history')
      .select('id, message, reply')
      .eq('user_id', userId)
      .eq('waifu_name', waifu.name)
      .order('created_at', { ascending: true })
  }, [userId, waifu.name])

  const applyHistory = useCallback(
    ({ data, error }: { data: { id: string; message: string; reply: string }[] | null; error: unknown }) => {
      if (error) {
        setStatus('error')
        return
      }
      setMessages(
        (data ?? []).flatMap((row) => [
          { id: `${row.id}-q`, from: 'user' as const, text: row.message },
          { id: `${row.id}-a`, from: 'waifu' as const, text: row.reply },
        ]),
      )
      setStatus('ready')
    },
    [],
  )

  const retry = () => {
    setStatus('loading')
    fetchHistory().then(applyHistory)
  }

  useEffect(() => {
    let cancelled = false
    fetchHistory().then((result) => {
      if (!cancelled) applyHistory(result)
    })
    return () => {
      cancelled = true
      clearTimeout(replyTimer.current)
    }
  }, [fetchHistory, applyHistory])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text || typing) return
    setInput('')
    setSaveError(false)
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: 'user', text }])
    setTyping(true)

    const pool = waifu.replies.filter((r) => r !== lastReply.current)
    const reply = pool[Math.floor(Math.random() * pool.length)]
    lastReply.current = reply

    replyTimer.current = setTimeout(async () => {
      setTyping(false)
      const msgId = crypto.randomUUID()
      setMessages((prev) => [...prev, { id: msgId, from: 'waifu', text: reply }])

      if (userId === 'guest') {
        if (typeof window !== 'undefined') {
          const key = `waifunova_chat_${waifu.name}`
          const existing = JSON.parse(localStorage.getItem(key) || '[]')
          existing.push({ id: msgId, message: text, reply })
          localStorage.setItem(key, JSON.stringify(existing.slice(-50)))
        }
      } else {
        const { error } = await createClient()
          .from('chat_history')
          .insert({ user_id: userId, waifu_name: waifu.name, message: text, reply })
        if (error) setSaveError(true)
      }
    }, 900 + Math.random() * 700)
  }

  return (
    <section
      aria-label={`Obrolan dengan ${waifu.name}`}
      className="flex h-[72dvh] flex-col overflow-hidden rounded-[20px] border border-line bg-surface lg:sticky lg:top-4 lg:h-[calc(100dvh-5.5rem)]"
    >
      <header className="flex items-center gap-3 border-b border-line px-5 py-4">
        <div className="relative size-11 overflow-hidden rounded-[12px] bg-surface-2">
          <Image src={waifu.img} alt="" fill sizes="44px" className="object-cover object-top" />
        </div>
        <div className="min-w-0 leading-tight">
          <h1 className="font-semibold">{waifu.name}</h1>
          <p className="truncate text-sm text-muted" aria-live="polite">
            {typing ? <span className="text-accent">sedang mengetik...</span> : waifu.trait}
          </p>
        </div>
        <span className="ml-auto font-jp text-lg text-accent" aria-hidden>
          {waifu.kana}
        </span>
      </header>

      <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-6" aria-live="polite">
        {status === 'loading' && <HistorySkeleton />}

        {status === 'error' && (
          <div className="m-auto max-w-[32ch] text-center">
            <p className="font-medium">Riwayat obrolan gagal dimuat.</p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
            >
              <ArrowClockwiseIcon size={16} weight="bold" />
              Coba lagi
            </button>
          </div>
        )}

        {status === 'ready' && messages.length === 0 && !typing && (
          <EmptyState waifu={waifu} onPick={send} />
        )}

        <AnimatePresence initial={false}>
          {status === 'ready' &&
            messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                style={{ transformOrigin: m.from === 'user' ? 'bottom right' : 'bottom left' }}
              >
                <MessageBubble from={m.from}>{m.text}</MessageBubble>
              </motion.div>
            ))}
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TypingDots label={`${waifu.name} sedang mengetik`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="border-t border-line p-3"
      >
        <label htmlFor="pesan" className="sr-only">
          Pesan untuk {waifu.name}
        </label>
        <div className="flex items-center gap-2 rounded-full border border-line bg-bg p-1.5 pl-5 focus-within:ring-2 focus-within:ring-accent">
          <input
            id="pesan"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Tulis pesan untuk ${waifu.name}`}
            autoComplete="off"
            maxLength={500}
            className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted focus-visible:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing || status !== 'ready'}
            aria-label="Kirim pesan"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-40"
          >
            <PaperPlaneRightIcon size={18} weight="fill" />
          </button>
        </div>
        {saveError && (
          <p role="alert" className="mt-2 px-4 text-sm text-accent">
            Pesan terakhir belum tersimpan. Riwayatnya mungkin hilang saat halaman dimuat ulang.
          </p>
        )}
      </form>
    </section>
  )
}

function EmptyState({ waifu, onPick }: { waifu: Waifu; onPick: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="m-auto flex max-w-[40ch] flex-col items-center text-center"
    >
      <p className="font-jp text-5xl text-accent" aria-hidden>
        {waifu.kana}
      </p>
      <p className="mt-5 text-xl font-semibold tracking-tight">Mulai obrolan pertamamu dengan {waifu.name}.</p>
      <p className="mt-2 text-muted">{waifu.bio}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {waifu.starters.map((s, i) => (
          <motion.button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
            className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function HistorySkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-label="Memuat riwayat obrolan">
      <div className="skeleton ml-auto h-11 w-2/5 rounded-[20px]" />
      <div className="skeleton h-16 w-3/5 rounded-[20px]" />
      <div className="skeleton ml-auto h-11 w-1/3 rounded-[20px]" />
      <div className="skeleton h-11 w-1/2 rounded-[20px]" />
    </div>
  )
}
