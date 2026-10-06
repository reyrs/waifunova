import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { enhanceAnimePrompt, type AnimeStyle } from '@/lib/prompt-enhancer'

const MODEL = process.env.HUGGINGFACE_MODEL ?? 'black-forest-labs/FLUX.1-schnell'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''
  if (!prompt || prompt.length > 400) {
    return NextResponse.json({ error: 'invalid-prompt' }, { status: 400 })
  }

  const style = (body?.style as AnimeStyle) ?? 'modern'
  const key = process.env.HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: 'not-configured', message: 'HUGGINGFACE_API_KEY belum dikonfigurasi di server.' },
      { status: 503 }
    )
  }

  const enhancedPrompt = enhanceAnimePrompt(prompt, style)

  const upstream = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: enhancedPrompt }),
  }).catch(() => null)

  if (upstream && (upstream.status === 401 || upstream.status === 403)) {
    const errorBody = await upstream.text().catch(() => '')
    const isExpired = errorBody.toLowerCase().includes('expired')
    return NextResponse.json(
      {
        error: isExpired ? 'token-expired' : 'unauthorized-upstream',
        message: isExpired
          ? 'Hugging Face API token sudah expired. Perbarui token di file .env.local.'
          : 'Hugging Face API token tidak valid atau tidak memiliki izin.',
      },
      { status: 401 }
    )
  }

  if (!upstream?.ok || !upstream.body) {
    return NextResponse.json({ error: 'upstream', message: 'Gagal menghubungi model generator.' }, { status: 502 })
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'image/png',
      'Cache-Control': 'no-store',
    },
  })
}

