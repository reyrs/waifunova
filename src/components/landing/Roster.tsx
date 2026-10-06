'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLayoutEffect, useRef } from 'react'
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { WAIFUS } from '@/lib/waifus'
import { useEnhancedMotion } from '@/lib/use-media-query'

// Desktop: the section pins and vertical scroll pans the roster sideways.
// Mobile and reduced motion: a plain horizontal scroll-snap row.
export function Roster() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const enhanced = useEnhancedMotion()
  const distance = useMotionValue(0)

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const pan = useTransform(scrollYProgress, [0.05, 0.95], [0, 1], { clamp: true })
  const x = useTransform(() => -distance.get() * pan.get())
  const imageShift = useTransform(pan, [0, 1], ['-6%', '6%'])

  useLayoutEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => distance.set(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [distance])

  return (
    <section
      ref={section}
      id="karakter"
      aria-labelledby="karakter-judul"
      className="relative scroll-mt-16 md:motion-safe:h-[420vh]"
    >
      <div className="flex flex-col justify-center overflow-hidden py-24 md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:h-[100dvh] md:motion-safe:py-0">
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8">
          <h2 id="karakter-judul" className="max-w-[16ch] text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
            Lima karakter, lima cara ngobrol.
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg text-muted">
            Masing-masing punya kebiasaan, selera, dan cara bercanda sendiri.
          </p>
        </div>

        <motion.div
          ref={track}
          style={enhanced ? { x } : undefined}
          className="mt-10 flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mt-14 md:gap-8 md:px-8 md:motion-safe:w-max md:motion-safe:overflow-visible md:motion-safe:snap-none"
        >
          {WAIFUS.map((w) => (
            <article key={w.name} className="w-[78vw] max-w-[340px] shrink-0 snap-start md:w-[340px]">
              <div className="relative aspect-[665/842] overflow-hidden rounded-[20px] bg-surface-2">
                <motion.div
                  style={enhanced ? { x: imageShift } : undefined}
                  className="absolute inset-0 scale-[1.14]"
                >
                  <Image
                    src={w.img}
                    alt={`Potret ${w.name}`}
                    fill
                    sizes="(min-width: 768px) 340px, 78vw"
                    className="object-cover"
                  />
                </motion.div>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-tight">{w.name}</h3>
                <span className="font-jp text-lg text-accent" aria-hidden>
                  {w.kana}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-muted">{w.trait}</p>
              <p className="mt-3 text-base leading-relaxed">{w.bio}</p>
            </article>
          ))}

          <div className="flex w-[78vw] max-w-[340px] shrink-0 snap-start flex-col justify-center md:w-[340px]">
            <p className="font-jp text-4xl leading-tight text-accent md:text-5xl" aria-hidden>
              だれにする？
            </p>
            <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight">Udah ada yang bikin penasaran?</p>
            <Link
              href="/chat"
              className="group mt-8 flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Mulai ngobrol
              <ArrowRightIcon size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {enhanced && <ProgressLine progress={pan} />}
      </div>
    </section>
  )
}

function ProgressLine({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="mx-auto mt-10 w-full max-w-[1400px] px-8" aria-hidden>
      <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-accent" />
    </div>
  )
}
