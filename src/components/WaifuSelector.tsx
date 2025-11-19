// src/components/WaifuSelector.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

const WAIFUS = [
  { name: 'Sakura', img: 'https://i.ibb.co/5kL9Y8P/waifu-cute.png', color: 'pink' },
  { name: 'Yumi', img: 'https://i.ibb.co/3h9Yn8Y/yumi-anime.png', color: 'purple' },
  { name: 'Aiko', img: 'https://i.ibb.co/4pK7vZJ/aiko-cute.png', color: 'blue' },
  { name: 'Miku', img: 'https://i.ibb.co/7zL5sXv/miku-waifu.png', color: 'teal' },
  { name: 'Reina', img: 'https://i.ibb.co/9hK9vZk/reina-anime.png', color: 'orange' },
]

interface Props { userId: string }

export function WaifuSelector({ userId }: Props) {
  const [selected, setSelected] = useState(WAIFUS[0])
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.from('user_profiles').select('favorite_waifu').eq('id', userId).single()
      if (data?.favorite_waifu) {
        const waifu = WAIFUS.find(w => w.name === data.favorite_waifu)
        if (waifu) setSelected(waifu)
      }
    }
    loadProfile()
  }, [userId, supabase])

  const changeWaifu = async (waifu: typeof WAIFUS[0]) => {
    setSelected(waifu)
    await supabase.from('user_profiles').update({ favorite_waifu: waifu.name }).eq('id', userId)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-pink-400">Pilih Waifu ♡</h2>
      {WAIFUS.map(w => (
        <button
          key={w.name}
          onClick={() => changeWaifu(w)}
          className={`block w-full rounded-2xl overflow-hidden ring-4 ring-transparent transition-all ${
            selected.name === w.name ? `ring-${w.color}-500 shadow-2xl shadow-${w.color}-500/50` : ''
          }`}
        >
          <img src={w.img} alt={w.name} className="w-full" />
          <p className="py-3 text-center font-semibold bg-black/70">{w.name}</p>
        </button>
      ))}
    </div>
  )
}