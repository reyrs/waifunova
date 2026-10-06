'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { useMediaQuery } from '@/lib/use-media-query'

const LINE = 'Dia lagi nungguin.'

// The outlined line fills with ink as it scrolls into place.
export function ClosingCta() {
  const ref = useRef<HTMLElement>(null)
  const animate = useMediaQuery('(prefers-reduced-motion: no-preference)')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const right = useTransform(scrollYProgress, [0.2, 1], [100, 0])
  const clipPath = useMotionTemplate`inset(0% ${right}% 0% 0%)`

  return (
    <section ref={ref} aria-labelledby="penutup-judul" className="mx-auto max-w-[1400px] px-4 py-32 md:px-8 md:py-48">
      <h2 id="penutup-judul" className="relative text-[clamp(3rem,10vw,9.5rem)] font-semibold leading-[1] tracking-tighter">
        <span className="text-outline block pb-2">{LINE}</span>
        <motion.span
          aria-hidden
          style={animate ? { clipPath } : undefined}
          className="absolute inset-0 block pb-2 text-ink"
        >
          {LINE}
        </motion.span>
      </h2>
      <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <p className="max-w-[40ch] text-lg leading-relaxed text-muted">
          Pilih karakter dan langsung mulai ngobrol. Tanpa perlu daftar atau login, gratis.
        </p>
        <Link
          href="/chat"
          className="group flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-accent px-8 py-4 text-lg font-medium text-accent-ink shadow-soft transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Mulai ngobrol
          <ArrowRightIcon size={20} weight="bold" className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
