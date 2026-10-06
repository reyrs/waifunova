'use client'

import { motion } from 'motion/react'

export function MessageBubble({
  from,
  children,
}: {
  from: 'user' | 'waifu'
  children: React.ReactNode
}) {
  const mine = from === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 text-[15px] leading-relaxed ${
          mine
            ? 'rounded-[20px] rounded-br-md bg-ink text-bg'
            : 'rounded-[20px] rounded-bl-md border border-line bg-surface text-ink'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export function TypingDots({ label }: { label: string }) {
  return (
    <div className="flex justify-start" role="status" aria-label={label}>
      <div className="flex items-center gap-1.5 rounded-[20px] rounded-bl-md border border-line bg-surface px-4 py-4">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-muted"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}
