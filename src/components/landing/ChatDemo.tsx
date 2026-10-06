'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { MessageBubble } from '@/components/studio/MessageBubble'
import { useEnhancedMotion } from '@/lib/use-media-query'

type Line = { from: 'user' | 'waifu'; text: string; at: number }

// "at" is the scroll progress where each line lands. Typing windows sit in the
// gaps before Aiko answers, so the conversation plays out at reading pace.
const SCRIPT: Line[] = [
  { from: 'user', text: 'Kalah ranked lima kali berturut-turut.', at: 0.06 },
  { from: 'waifu', text: 'Skill issue sih itu. Bercanda, bercanda.', at: 0.28 },
  { from: 'user', text: 'Jahat banget.', at: 0.42 },
  { from: 'waifu', text: 'Yaelah, gitu doang galau. Sini aku hibur.', at: 0.62 },
  { from: 'waifu', text: 'Gas mabar abis ini? Aku carry.', at: 0.76 },
]
const TYPING: [number, number][] = [
  [0.14, 0.28],
  [0.5, 0.62],
]

export function ChatDemo() {
  const ref = useRef<HTMLElement>(null)
  const enhanced = useEnhancedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const typing = useTransform(scrollYProgress, (p) =>
    TYPING.some(([a, b]) => p >= a && p < b) ? 1 : 0,
  )
  const idle = useTransform(typing, (t) => 1 - t)

  return (
    <section ref={ref} aria-labelledby="chat-judul" className="relative md:motion-safe:h-[320vh]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 py-24 md:grid-cols-12 md:px-8 md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:h-[100dvh] md:motion-safe:py-0">
        <div className="md:col-span-6 lg:col-span-5">
          <div className="overflow-hidden rounded-[20px] border border-line bg-surface-2/60 shadow-soft">
            <header className="flex items-center gap-3 border-b border-line bg-surface px-5 py-4">
              <div className="relative size-11 overflow-hidden rounded-[12px] bg-surface-2">
                <Image src="/art/aiko.webp" alt="" fill sizes="44px" className="object-cover object-top" />
              </div>
              <div className="leading-tight">
                <p className="font-semibold">Aiko</p>
                <p className="relative h-5 text-sm text-muted">
                  {enhanced ? (
                    <>
                      <motion.span style={{ opacity: idle }} className="absolute inset-0">
                        online
                      </motion.span>
                      <motion.span style={{ opacity: typing }} className="absolute inset-0 text-accent">
                        sedang mengetik...
                      </motion.span>
                    </>
                  ) : (
                    'online'
                  )}
                </p>
              </div>
              <span className="ml-auto font-jp text-accent" aria-hidden>
                アイコ
              </span>
            </header>
            <div className="flex min-h-[340px] flex-col gap-3 p-5">
              {SCRIPT.map((line, i) => (
                <ScriptLine key={i} line={line} progress={scrollYProgress} enhanced={enhanced} index={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 lg:col-start-8">
          <h2 id="chat-judul" className="max-w-[14ch] text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
            Dia balas dengan gayanya sendiri.
          </h2>
          <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-muted">
            Riwayat obrolan tersimpan per karakter, jadi besok kamu bisa lanjut dari situ.
          </p>
        </div>
      </div>
    </section>
  )
}

function ScriptLine({
  line,
  progress,
  enhanced,
  index,
}: {
  line: Line
  progress: MotionValue<number>
  enhanced: boolean
  index: number
}) {
  const opacity = useTransform(progress, [line.at, line.at + 0.04], [0, 1])
  const y = useTransform(progress, [line.at, line.at + 0.04], [14, 0])

  if (enhanced) {
    return (
      <motion.div style={{ opacity, y }}>
        <MessageBubble from={line.from}>{line.text}</MessageBubble>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <MessageBubble from={line.from}>{line.text}</MessageBubble>
    </motion.div>
  )
}
