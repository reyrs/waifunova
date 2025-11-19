// src/app/api/placeholder/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const imageUrl = 'https://i.ibb.co/4pK7vZJ/aiko-cute.png' // waifu cantik sebagai fallback
  const res = await fetch(imageUrl)
  const blob = await res.blob()
  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}