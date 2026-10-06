'use client'

import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react'
import { WAIFUS } from '@/lib/waifus'
import { useMediaQuery } from '@/lib/use-media-query'

// The strip drifts on its own and speeds up, skews and flips direction with
// scroll velocity, so it answers the user's scrolling instead of looping blindly.
export function NameMarquee() {
  const animate = useMediaQuery('(prefers-reduced-motion: no-preference)')
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false })
  const skewX = useTransform(velocity, [-2000, 2000], [8, -8])
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const direction = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (!animate) return
    const b = boost.get()
    if (b < 0) direction.current = 1
    else if (b > 0) direction.current = -1
    baseX.set(baseX.get() + direction.current * (1 + Math.abs(b)) * (delta / 1000) * 1.6)
  })

  const items = [...WAIFUS, ...WAIFUS]

  return (
    <section aria-label="Nama karakter" className="overflow-hidden border-y border-line py-6 md:py-8">
      <motion.div style={{ x, skewX: animate ? skewX : 0 }} className="flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-baseline">
            {items.map((w, i) => (
              <span key={`${w.name}-${i}`} className="flex items-baseline gap-5 px-6 md:px-10">
                <span className="font-jp text-5xl leading-none md:text-7xl">{w.kana}</span>
                <span className="text-outline text-5xl font-semibold leading-none tracking-tighter md:text-7xl">
                  {w.name}
                </span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  )
}
