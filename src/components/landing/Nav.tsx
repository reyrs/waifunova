'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Wordmark } from '@/components/Wordmark'
import { ThemeControl } from '@/components/ThemeControl'

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Hide while reading down the page, return as soon as the user scrolls up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    const nextHidden = y > prev && y > 240
    if (nextHidden !== hidden) setHidden(nextHidden)
    const nextScrolled = y > 12
    if (nextScrolled !== scrolled) setScrolled(nextScrolled)
  })

  return (
    <motion.header
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 34 }}
      className="fixed inset-x-0 top-0 z-30"
    >
      <div
        className={`mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 transition-colors duration-300 md:px-8 ${
          scrolled ? 'bg-bg/80 backdrop-blur-md' : ''
        }`}
      >
        <Wordmark />
        <nav aria-label="Utama" className="flex items-center gap-3">
          <a
            href="#karakter"
            className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink sm:block"
          >
            Karakter
          </a>
          <a
            href="#gambar"
            className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink sm:block"
          >
            Generator
          </a>
          <div className="hidden sm:block">
            <ThemeControl id="nav-theme" />
          </div>
          <Link
            href="/chat"
            className="group flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform active:scale-[0.98]"
          >
            Mulai ngobrol
            <ArrowRightIcon size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </nav>
      </div>
    </motion.header>
  )
}
