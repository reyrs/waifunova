import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { NameMarquee } from '@/components/landing/NameMarquee'
import { Roster } from '@/components/landing/Roster'
import { ChatDemo } from '@/components/landing/ChatDemo'
import { GeneratorDemo } from '@/components/landing/GeneratorDemo'
import { ClosingCta } from '@/components/landing/ClosingCta'
import { Wordmark } from '@/components/Wordmark'
import { ThemeControl } from '@/components/ThemeControl'

export default function Home() {
  return (
    <>
      <Nav />
      <main id="konten">
        <Hero />
        <NameMarquee />
        <Roster />
        <ChatDemo />
        <GeneratorDemo />
        <ClosingCta />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <Wordmark />
          <div className="flex flex-wrap items-center gap-6">
            <p className="text-sm text-muted">© 2026 Waifunova. Dibuat oleh anak Indonesia.</p>
            <ThemeControl id="footer-theme" />
          </div>
        </div>
      </footer>
    </>
  )
}
