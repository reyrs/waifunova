import Image from 'next/image'
import { Wordmark } from '@/components/Wordmark'
import { AuthForm } from './AuthForm'

export const metadata = { title: 'Masuk - Waifunova' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { error, next } = await searchParams
  // Only allow internal redirects.
  const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : '/chat'

  return (
    <main id="konten" className="mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 gap-10 px-4 py-6 md:grid-cols-12 md:px-8">
      <div className="flex flex-col md:col-span-5 lg:col-span-4">
        <Wordmark />
        <div className="flex flex-1 flex-col justify-center py-12">
          <AuthForm next={safeNext} callbackError={error === 'callback'} />
        </div>
      </div>

      <div className="relative hidden md:col-span-7 md:col-start-6 md:block lg:col-span-7 lg:col-start-6">
        <div className="sticky top-6 h-[calc(100dvh-3rem)] overflow-hidden rounded-[20px] bg-surface-2">
          <Image
            src="/art/miku.webp"
            alt="Miku, rambut cokelat dicepol dua dan memakai celemek, tersenyum"
            fill
            priority
            sizes="55vw"
            className="object-cover object-top"
          />
        </div>
        <p
          aria-hidden
          className="tategaki absolute -left-14 top-10 hidden font-jp text-6xl leading-none text-accent lg:block"
        >
          おかえり
        </p>
      </div>
    </main>
  )
}
