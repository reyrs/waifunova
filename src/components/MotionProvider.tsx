'use client'

import { MotionConfig } from 'motion/react'

// Entrance and hover animations collapse to instant when the OS asks for
// reduced motion. Scroll-linked effects check useEnhancedMotion separately.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
