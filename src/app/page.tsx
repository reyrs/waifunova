import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { WaifuSelector } from '@/components/WaifuSelector'
import { ChatBox } from '@/components/ChatBox'
import { ImageGenerator } from '@/components/ImageGenerator'
import ClientThemeToggle from '@/components/ClientThemeToggle'

export default async function Home() {
  const supabase = await createServerSupabase()  // ← TAMBAH AWAIT!
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white">
      <header className="border-b border-white/10 backdrop-blur-lg bg-black/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            WAIFUNOVA
          </h1>
          <ClientThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <WaifuSelector userId={session.user.id} />
        <ChatBox userId={session.user.id} />
        <ImageGenerator userId={session.user.id} />
      </main>
    </div>
  )
}