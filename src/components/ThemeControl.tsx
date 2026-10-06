'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { motion } from 'motion/react'
import { DesktopIcon, MoonIcon, SunIcon } from '@phosphor-icons/react'

type Pref = 'system' | 'light' | 'dark'

const OPTIONS: { value: Pref; label: string; Icon: typeof SunIcon }[] = [
  { value: 'system', label: 'Ikuti sistem', Icon: DesktopIcon },
  { value: 'light', label: 'Terang', Icon: SunIcon },
  { value: 'dark', label: 'Gelap', Icon: MoonIcon },
]

function readPref(): Pref {
  try {
    const saved = localStorage.getItem('theme')
    return saved === 'light' || saved === 'dark' ? saved : 'system'
  } catch {
    return 'system'
  }
}

const EVENT = 'waifunova-theme'

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

function apply(pref: Pref) {
  const dark =
    pref === 'dark' || (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
}

export function ThemeControl({ id = 'theme' }: { id?: string }) {
  // Server render has no preference yet, so no option is marked until hydration.
  const pref = useSyncExternalStore<Pref | null>(subscribe, readPref, () => null)

  useEffect(() => {
    if (pref !== 'system') return
    const mql = matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [pref])

  const choose = (next: Pref) => {
    apply(next)
    try {
      if (next === 'system') localStorage.removeItem('theme')
      else localStorage.setItem('theme', next)
    } catch {}
    window.dispatchEvent(new Event(EVENT))
  }

  return (
    <div
      role="radiogroup"
      aria-label="Tema tampilan"
      className="relative flex items-center rounded-full border border-line bg-surface p-1"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = pref === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => choose(value)}
            className="relative grid size-8 place-items-center rounded-full text-muted transition-colors duration-200 hover:text-ink aria-checked:text-ink"
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-surface-2"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon size={16} weight="bold" className="relative" />
          </button>
        )
      })}
    </div>
  )
}
