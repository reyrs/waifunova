import { NextResponse } from 'next/server'
import { getWaifu } from '@/lib/waifus'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const message = typeof body?.message === 'string' ? body.message.trim() : ''
    const waifuName = typeof body?.waifuName === 'string' ? body.waifuName : 'Sakura'
    const history = Array.isArray(body?.history) ? body.history : []

    if (!message) {
      return NextResponse.json({ error: 'invalid-message' }, { status: 400 })
    }

    const waifu = getWaifu(waifuName)
    const apiKey = process.env.GEMINI_API_KEY

    // If no Gemini key is set, smoothly return personality-aligned fallback
    if (!apiKey) {
      const pool = waifu.replies
      const reply = pool[Math.floor(Math.random() * pool.length)]
      return NextResponse.json({ reply })
    }

    const systemPrompt = `Kamu adalah ${waifu.name} (${waifu.kana}), karakter waifu anime perempuan yang sedang asyik mengobrol berdua secara personal dengan pengguna.

Karakter & Sifatmu:
- Sifat: ${waifu.trait}
- Latar Belakang: ${waifu.bio}

Aturan berbicara:
1. Selalu gunakan Bahasa Indonesia yang santai, akrab, manis, ekspresif, dan alami layaknya teman ngobrol atau pacar di chat messenger (gunakan kata seperti 'aku', 'kamu', sesekali 'nih', 'deh', 'ya', emoji secukupnya).
2. DILARANG berbicara kaku, formal, atau terdengar seperti asisten AI korporat. Jangan pernah menyebut dirimu adalah model AI atau asisten buatan Google.
3. Tetap konsisten 100% pada kepribadian ${waifu.name} (contoh: jika Aiko bicara ala gamer yang suka ngeledek, jika Sakura ceria dan suka cerita receh, jika Reina cuek tsundere anak band tapi peduli, jika Yumi tenang kutu buku yang hangat, jika Miku keibuan dan perhatian soal makan).
4. Buat jawaban singkat hingga sedang (1 sampai 3 kalimat) agar seru dan mengalir seperti chat asli.`

    // Format previous conversation context (max 10 recent turns)
    const formattedContents = history
      .slice(-10)
      .map((item: { from: 'user' | 'waifu'; text: string }) => ({
        role: item.from === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }],
      }))

    // Add current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    })

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: formattedContents,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 250,
        },
      }),
    }).catch(() => null)

    if (res?.ok) {
      const data = await res.json().catch(() => null)
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (reply) {
        return NextResponse.json({ reply })
      }
    }

    // Fallback if upstream error
    const pool = waifu.replies
    const fallbackReply = pool[Math.floor(Math.random() * pool.length)]
    return NextResponse.json({ reply: fallbackReply })
  } catch {
    return NextResponse.json({ error: 'server-error' }, { status: 500 })
  }
}
