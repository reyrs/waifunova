'use client'

import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Desktop and no reduced-motion preference: safe to pin and scrub on scroll. */
export function useEnhancedMotion() {
  return useMediaQuery('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
}
