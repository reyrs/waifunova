// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const protectedPaths = ['/']
  const path = request.nextUrl.pathname

  const isProtected = protectedPaths.some(p => path.startsWith(p))

  if (isProtected) {
    const token = request.cookies.get('supabase.auth.token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
}