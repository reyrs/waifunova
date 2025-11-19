// src/components/ClientAuthProvider.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login')
      else router.push('/')
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  return <>{children}</>
}