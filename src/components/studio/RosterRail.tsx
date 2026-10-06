'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { WAIFUS, type Waifu } from '@/lib/waifus'

export function RosterRail({ current, onPick }: { current: Waifu; onPick: (w: Waifu) => void }) {
  return (
    <nav aria-label="Pilih karakter" className="lg:sticky lg:top-4 lg:self-start">
      <h2 className="sr-only">Karakter</h2>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {WAIFUS.map((w) => {
          const active = w.name === current.name
          return (
            <li key={w.name} className="shrink-0">
              <button
                type="button"
                onClick={() => onPick(w)}
                aria-pressed={active}
                className="group relative flex w-full items-center gap-3 rounded-[20px] p-2 pr-4 text-left transition-colors hover:bg-surface-2/60 active:scale-[0.99]"
              >
                {active && (
                  <motion.span
                    layoutId="rail-active"
                    className="absolute inset-0 rounded-[20px] border border-line bg-surface shadow-soft"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative size-12 shrink-0 overflow-hidden rounded-[12px] bg-surface-2">
                  <Image
                    src={w.img}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover object-top transition-transform duration-500 ease-out-expo group-hover:scale-110"
                  />
                </span>
                <span className="relative min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="font-semibold">{w.name}</span>
                    <span className={`font-jp text-xs ${active ? 'text-accent' : 'text-muted'}`} aria-hidden>
                      {w.kana}
                    </span>
                  </span>
                  <span className="block whitespace-nowrap text-sm text-muted lg:whitespace-normal">{w.trait}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
