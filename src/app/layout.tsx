import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Dela_Gothic_One } from 'next/font/google'
import { MotionProvider } from '@/components/MotionProvider'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
// Japanese glyphs live outside the latin subset, so skip preloading and let
// the browser fetch only the unicode ranges the page actually uses.
const dela = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dela',
  preload: false,
})

export const metadata: Metadata = {
  title: 'Waifunova - Ngobrol dengan karakter anime',
  description:
    'Pilih karakter anime favoritmu, ngobrol kapan aja, dan bikin ilustrasi anime dari satu kalimat.',
  openGraph: {
    title: 'Waifunova',
    description: 'Ngobrol dengan karakter anime dan bikin ilustrasi dari satu kalimat.',
    images: ['/art/sakura.webp'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f2f4' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0e12' },
  ],
}

// Runs before paint so the stored theme never flashes.
const themeScript = `(function(){try{var p=localStorage.getItem('theme');var d=p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${dela.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-[100dvh] font-sans antialiased">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Lewati ke konten
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
