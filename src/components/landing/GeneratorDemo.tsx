'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react'
import { SparkleIcon } from '@phosphor-icons/react'
import { useEnhancedMotion } from '@/lib/use-media-query'

const PROMPT = 'rambut biru panjang, jaket bomber, jalanan Tokyo malam hujan'

// Scroll drives the same sequence the real generator follows:
// type the prompt, press generate, the image resolves, then more results land.
export function GeneratorDemo() {
  const ref = useRef<HTMLElement>(null)
  const enhanced = useEnhancedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const typed = useTransform(p, [0.04, 0.32], [0, PROMPT.length])
  const text = useTransform(typed, (v) => PROMPT.slice(0, Math.round(v)))
  const press = useTransform(p, [0.33, 0.36, 0.39], [1, 0.94, 1])
  // Interpolate a number and build the string, so every frame gets a valid inset().
  const inset = useTransform(p, [0.4, 0.64], [44, 0])
  const clipPath = useMotionTemplate`inset(${inset}% round 20px)`
  const scale = useTransform(p, [0.4, 0.7], [1.3, 1])
  const thumbY = useTransform(p, [0.7, 0.84], [90, 0])
  const thumbOpacity = useTransform(p, [0.7, 0.8], [0, 1])

  return (
    <section ref={ref} id="gambar" aria-labelledby="gambar-judul" className="relative scroll-mt-16 md:motion-safe:h-[340vh]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 py-24 md:grid-cols-12 md:px-8 md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:h-[100dvh] md:motion-safe:py-0">
        <div className="md:col-span-5">
          <h2 id="gambar-judul" className="max-w-[12ch] text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
            Satu kalimat, satu ilustrasi.
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-muted">
            Tulis rambut, baju, dan suasananya. Generator bikin gambarnya dalam hitungan detik.
          </p>

          <div className="mt-9 flex items-center gap-2 rounded-full border border-line bg-surface p-2 pl-5 shadow-soft">
            <p className="min-h-6 flex-1 truncate text-[15px]" aria-label={`Contoh prompt: ${PROMPT}`}>
              {enhanced ? (
                <>
                  <motion.span>{text}</motion.span>
                  <motion.span
                    aria-hidden
                    className="ml-px inline-block h-5 w-px translate-y-1 bg-accent"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </>
              ) : (
                PROMPT
              )}
            </p>
            <motion.span
              style={enhanced ? { scale: press } : undefined}
              className="flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink"
              aria-hidden
            >
              <SparkleIcon size={16} weight="fill" />
              Generate
            </motion.span>
          </div>
        </div>

        <div className="relative md:col-span-7 md:col-start-6">
          <div className="skeleton relative mx-auto aspect-[768/724] w-full max-w-[min(100%,66dvh)] rounded-[20px]">
            <motion.div
              style={enhanced ? { clipPath } : undefined}
              className="absolute inset-0 overflow-hidden rounded-[20px]"
            >
              <motion.div style={enhanced ? { scale } : undefined} className="absolute inset-0">
                <Image
                  src="/art/gen-tokyo.webp"
                  alt="Ilustrasi anime: perempuan berambut biru dengan jaket bomber di jalanan Tokyo yang basah oleh hujan malam"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 -bottom-10 hidden justify-between md:flex">
            {[
              {
                src: '/art/gen-beach.webp',
                alt: 'Ilustrasi anime: perempuan berambut putih dengan gaun di pantai saat matahari terbenam',
                rotate: '-rotate-6',
              },
              {
                src: '/art/gen-shrine.webp',
                alt: 'Ilustrasi anime: perempuan berkimono di tangga kuil saat musim gugur',
                rotate: 'rotate-[5deg]',
              },
            ].map((t) => (
              <motion.div
                key={t.src}
                style={enhanced ? { y: thumbY, opacity: thumbOpacity } : undefined}
                className={`relative aspect-[768/724] w-[30%] overflow-hidden rounded-[20px] border-4 border-bg shadow-soft ${t.rotate}`}
              >
                <Image src={t.src} alt={t.alt} fill sizes="20vw" className="object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
