'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { useEnhancedMotion } from '@/lib/use-media-query'

const EASE = [0.16, 1, 0.3, 1] as const
const HEADLINE = ['Teman', 'ngobrol', 'yang', 'ingat', 'ceritamu.']
const KANA = 'ワイフノヴァ'.split('')

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const enhanced = useEnhancedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Each layer moves at its own speed as the hero leaves, so the stack reads as depth.
  const yBackLeft = useTransform(scrollYProgress, [0, 1], [0, -140])
  const yBackRight = useTransform(scrollYProgress, [0, 1], [0, -70])
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 60])
  const yKana = useTransform(scrollYProgress, [0, 1], [0, -260])
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, 90])

  const layer = (y: MotionValue<number>) => (enhanced ? { y } : undefined)

  return (
    <section
      ref={ref}
      className="relative mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 items-center gap-10 px-4 pb-16 pt-24 md:grid-cols-12 md:px-8"
    >
      <motion.div style={layer(yCopy)} className="relative z-10 md:col-span-6">
        <h1 className="text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-6xl lg:text-7xl">
          {HEADLINE.map((word, i) => (
            <span key={word} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className={`inline-block ${i === HEADLINE.length - 1 ? 'text-accent' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: EASE }}
              >
                {word}
              </motion.span>
              {i < HEADLINE.length - 1 && ' '}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="mt-6 max-w-[44ch] text-lg leading-relaxed text-muted"
        >
          Pilih satu dari lima karakter, ngobrol kapan aja, dan bikin ilustrasi anime dari satu kalimat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-6"
        >
          <Link
            href="/chat"
            className="group flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-7 py-4 text-base font-medium text-accent-ink shadow-soft transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            Mulai ngobrol
            <ArrowRightIcon size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#karakter"
            className="rounded-full text-base font-medium underline decoration-line decoration-2 underline-offset-8 transition-colors hover:decoration-accent"
          >
            Lihat karakter
          </a>
        </motion.div>
      </motion.div>

      <div className="relative h-[min(64svh,560px)] md:col-span-6 md:h-[min(82dvh,720px)]">
        <motion.p
          aria-hidden
          style={layer(yKana)}
          className="tategaki pointer-events-none absolute -right-2 top-0 hidden select-none font-jp text-[clamp(4rem,9vw,8.5rem)] leading-none text-outline opacity-60 md:block"
        >
          {KANA.map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: EASE }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>

        <Portrait
          src="/art/yumi.webp"
          alt="Yumi, rambut hitam panjang dan berkacamata, memegang buku"
          style={layer(yBackLeft)}
          className="left-0 top-[6%] w-[44%] -rotate-6"
          delay={0.35}
        />
        <Portrait
          src="/art/reina.webp"
          alt="Reina, rambut merah panjang dan jaket kulit, membawa gitar"
          style={layer(yBackRight)}
          className="right-[14%] top-0 w-[40%] rotate-[5deg]"
          delay={0.45}
        />
        <Portrait
          src="/art/sakura.webp"
          alt="Sakura, rambut pink pendek dan kardigan, tersenyum"
          style={layer(yFront)}
          className="bottom-0 left-[24%] w-[52%] -rotate-1"
          delay={0.2}
          priority
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.1 }}
            className="absolute -left-[22%] top-[18%] origin-bottom-right rounded-[20px] rounded-br-md bg-surface px-4 py-3 text-sm font-medium shadow-soft"
          >
            Hari ini gimana?
          </motion.div>
        </Portrait>
      </div>
    </section>
  )
}

function Portrait({
  src,
  alt,
  className,
  style,
  delay,
  priority,
  children,
}: {
  src: string
  alt: string
  className: string
  style?: { y: MotionValue<number> }
  delay: number
  priority?: boolean
  children?: React.ReactNode
}) {
  return (
    <motion.div style={style} className={`absolute ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 18, delay }}
        className="relative"
      >
        <div className="relative aspect-[665/842] overflow-hidden rounded-[20px] bg-surface-2 shadow-soft">
          <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 768px) 26vw, 50vw" className="object-cover" />
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}
