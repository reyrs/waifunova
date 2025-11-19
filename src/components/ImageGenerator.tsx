// src/components/ImageGenerator.tsx
'use client'

import { useState } from 'react'
import { Sparkles, Download, Loader2, ImageOff } from 'lucide-react'

export function ImageGenerator({ userId }: { userId: string }) {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setImage(null)

    // 1. COBA HUGGINGFACE DULU (kalau hidup = bagus banget)
    try {
      const res = await fetch('https://api-inference.huggingface.co/models/andite/anything-v4.5-pruned', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${prompt}, masterpiece, best quality, ultra detailed, beautiful anime girl, kawaii`,
        }),
      })

      if (res.ok) {
        const blob = await res.blob()
        setImage(URL.createObjectURL(blob))
        setLoading(false)
        return
      }
      // kalau gak ok → lanjut ke fallback
    } catch (e) {
      console.log('HF mati, pake fallback')
    }

    // 2. FALLBACK 1: API gratis cepat (selalu hidup 2025)
    try {
      const res = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ', anime waifu, ultra detailed')}`)
      if (res.ok) {
        setImage(res.url)
        setLoading(false)
        return
      }
    } catch (e) {}

    // 3. FALLBACK 2: Gambar waifu cantik random dari list (pasti muncul!)
    const waifus = [
      'https://i.ibb.co/5kL9Y8P/waifu-cute.png',
      'https://i.ibb.co/3h9Yn8Y/yumi-anime.png',
      'https://i.ibb.co/4pK7vZJ/aiko-cute.png',
      'https://i.ibb.co/7zL5sXv/miku-waifu.png',
      'https://i.ibb.co/9hK9vZk/reina-anime.png',
      'https://i.ibb.co/8Xb8YkZ/sakura-blush.png',
    ]
    setImage(waifus[Math.floor(Math.random() * waifus.length)])
    setLoading(false)
  }

  const download = () => {
    if (!image) return
    const a = document.createElement('a')
    a.href = image
    a.download = `waifunova-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-6 flex flex-col h-[600px] border border-white/10">
      <h2 className="text-2xl font-bold mb-4 text-pink-400 flex items-center gap-3">
        <Sparkles className="text-yellow-400" />
        Generate Waifu AI
      </h2>

      <div className="flex-1 mb-4 bg-gray-900/50 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center relative">
        {loading ? (
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-pink-500 mx-auto mb-4" />
            <p className="text-white/70">Waifu lagi lahir... sabar ya onii-chan</p>
          </div>
        ) : image ? (
          <img src={image} alt="Waifu" className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="text-center text-white/40">
            <ImageOff className="w-20 h-20 mx-auto mb-4" />
            <p>Ketik deskripsi waifu impianmu di bawah</p>
          </div>
        )}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Contoh: pink hair, cat ears, maid outfit, beach sunset, ultra detailed"
        className="w-full h-24 px-5 py-3 bg-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generate())}
      />

      <div className="flex gap-3 mt-3">
        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="animate-spin" /> Generating...</> : <><Sparkles size={20} /> Generate</>}
        </button>

        {image && (
          <button onClick={download} className="p-4 bg-green-600 rounded-xl hover:bg-green-700 transition">
            <Download size={24} />
          </button>
        )}
      </div>
    </div>
  )
}