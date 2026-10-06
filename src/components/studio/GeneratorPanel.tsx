'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { DownloadSimpleIcon, ImageIcon, SparkleIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { enhanceAnimePrompt, STYLE_PRESETS, type AnimeStyle } from '@/lib/prompt-enhancer'

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message?: string }
  | { kind: 'done'; url: string; prompt: string }

function fallbackUrl(prompt: string, style: AnimeStyle) {
  const seed = Math.floor(Math.random() * 1_000_000)
  const full = enhanceAnimePrompt(prompt, style)
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?seed=${seed}&nologo=true`
}

function preload(url: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('load failed'))
    img.src = url
  })
}

async function generateImage(prompt: string, style: AnimeStyle): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, style }),
  }).catch(() => null)

  if (res?.ok) {
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  }

  if (res) {
    const data = await res.json().catch(() => null)
    if (data?.error === 'token-expired') {
      throw new Error(data.message || 'API token Hugging Face sudah expired. Silakan perbarui di .env.local.')
    }
  }

  // Fallback endpoint
  const url = fallbackUrl(prompt, style)
  await preload(url)
  return url
}

export function GeneratorPanel() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<AnimeStyle>('modern')
  const [state, setState] = useState<State>({ kind: 'idle' })
  const blobUrl = useRef<string | null>(null)

  useEffect(() => () => {
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current)
  }, [])

  const generate = async () => {
    const text = prompt.trim()
    if (!text || state.kind === 'loading') return
    setState({ kind: 'loading' })
    try {
      const url = await generateImage(text, style)
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current)
      blobUrl.current = url.startsWith('blob:') ? url : null
      setState({ kind: 'done', url, prompt: text })
    } catch (err) {
      const message = err instanceof Error ? err.message : undefined
      setState({ kind: 'error', message })
    }
  }

  const download = async () => {
    if (state.kind !== 'done') return
    try {
      const blob = await (await fetch(state.url)).blob()
      const href = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = href
      a.download = `waifunova-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(href)
    } catch {
      window.open(state.url, '_blank', 'noopener')
    }
  }

  return (
    <section
      aria-labelledby="generator-judul"
      className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5 lg:sticky lg:top-4 lg:self-start"
    >
      <div className="flex items-center justify-between">
        <h2 id="generator-judul" className="flex items-center gap-2 font-semibold">
          <SparkleIcon size={18} weight="fill" className="text-accent" />
          Generator anime HD
        </h2>
        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted">
          Anti-slop 2D
        </span>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-surface-2 shadow-inner">
        <AnimatePresence mode="wait" initial={false}>
          {state.kind === 'idle' && (
            <Frame key="idle">
              <ImageIcon size={32} className="text-muted" />
              <p className="mt-3 max-w-[24ch] text-sm text-muted">Hasil gambar anime muncul di sini.</p>
            </Frame>
          )}
          {state.kind === 'loading' && (
            <Frame key="loading" className="skeleton">
              <p className="relative text-sm font-medium text-muted">
                Lagi digambar dengan kualitas HD. Biasanya 10 sampai 30 detik.
              </p>
            </Frame>
          )}
          {state.kind === 'error' && (
            <Frame key="error">
              <WarningCircleIcon size={32} className="text-accent" />
              <p className="mt-2 max-w-[28ch] text-sm font-medium">
                {state.message || 'Gambar gagal dibuat. Coba lagi atau ubah deskripsinya.'}
              </p>
            </Frame>
          )}
          {state.kind === 'done' && (
            <motion.img
              key={state.url}
              src={state.url}
              alt={`Hasil generator: ${state.prompt}`}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Style selector pills */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Gaya ilustrasi:</span>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(STYLE_PRESETS) as AnimeStyle[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={`truncate rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                style === s
                  ? 'bg-accent text-accent-ink shadow-soft'
                  : 'bg-surface-2 text-muted hover:text-foreground'
              }`}
            >
              {STYLE_PRESETS[s].label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          generate()
        }}
        className="flex flex-col gap-2"
      >
        <label htmlFor="prompt" className="text-sm font-medium">
          Deskripsi karakter / suasana
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              generate()
            }
          }}
          rows={3}
          maxLength={400}
          aria-describedby="prompt-hint"
          placeholder="Contoh: rambut pink, telinga kucing, baju maid, pantai sore..."
          className="resize-none rounded-[20px] border border-line bg-bg px-4 py-3 text-[15px] outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <p id="prompt-hint" className="text-xs text-muted">
          Prompt otomatis dioptimalkan ke gaya 2D anime murni tanpa efek plastik/slop.
        </p>
        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            disabled={!prompt.trim() || state.kind === 'loading'}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-50"
          >
            <SparkleIcon size={18} weight="fill" />
            {state.kind === 'loading' ? 'Menggambar...' : 'Generate HD'}
          </button>
          {state.kind === 'done' && (
            <button
              type="button"
              onClick={download}
              aria-label="Unduh gambar"
              className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:bg-surface-2 active:scale-95"
            >
              <DownloadSimpleIcon size={20} weight="bold" />
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

function Frame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${className}`}
    >
      {children}
    </motion.div>
  )
}
