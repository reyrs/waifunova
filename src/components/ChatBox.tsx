// src/components/ChatBox.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface Message {
  text: string
  isUser: boolean
}

interface Props {
  userId: string
}

export function ChatBox({ userId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentWaifu, setCurrentWaifu] = useState('Sakura')
  const supabase = createClient()
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Load waifu favorit
  useEffect(() => {
    const loadWaifu = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('favorite_waifu')
        .eq('id', userId)
        .single()
      if (data?.favorite_waifu) setCurrentWaifu(data.favorite_waifu)
    }
    loadWaifu()
  }, [userId, supabase])

  // Load chat history setiap waifu ganti
  useEffect(() => {
    const loadHistory = async () => {
      const { data } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .eq('waifu_name', currentWaifu)
        .order('created_at', { ascending: true })

      if (data && data.length > 0) {
        const loaded: Message[] = []
        data.forEach(row => {
          loaded.push({ text: row.message, isUser: true })
          loaded.push({ text: row.reply, isUser: false })
        })
        setMessages(loaded)
      } else {
        setMessages([])
      }
    }
    loadHistory()
  }, [userId, currentWaifu, supabase])

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')

    setMessages(prev => [...prev, { text: userMsg, isUser: true }, { text: '...', isUser: false }])

    const replies = [
      `Kyaa~ ${userMsg}?! Aku jadi malu nih, onii-chan! 💕`,
      `Ehehe... kamu baik banget sih sama aku ♡`,
      `Aku seneng banget diajak ngobrol gini sama kamu~ 🥰`,
      `Mau aku buatin gambar spesial nggak? Aku bantu promptnya! ✨`,
    ]
    const reply = replies[Math.floor(Math.random() * replies.length)]

    setTimeout(async () => {
      setMessages(prev => prev.map(m => m.text === '...' ? { ...m, text: reply } : m))

      await supabase.from('chat_history').insert({
        user_id: userId,
        waifu_name: currentWaifu,
        message: userMsg,
        reply,
      })
    }, 1200)
  }

  return (
    <div className="bg-black/60 backdrop-blur-2xl rounded-3xl p-6 flex flex-col h-[650px] border border-white/20 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
        Chat dengan {currentWaifu} ♡
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center text-white/50 mt-20 text-lg">
            <p>Mulai obrolan pertamamu dengan {currentWaifu}~</p>
            <p className="text-pink-400 mt-2">Dia lagi nungguin kamu nih ♡</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-6 py-4 rounded-3xl shadow-lg ${
                msg.isUser
                  ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder={`Ngobrol sama ${currentWaifu}...`}
          className="flex-1 bg-white/10 border border-white/30 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-pink-500/50 transition"
        />
        <button
          onClick={sendMessage}
          className="p-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition transform hover:scale-110 active:scale-95"
        >
          <Send size={28} className="text-white drop-shadow" />
        </button>
      </div>
    </div>
  )
}