import Link from 'next/link'

export function Wordmark({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-baseline gap-2 rounded-full" aria-label="Waifunova, beranda">
      <span className="font-jp text-xl leading-none tracking-tight">waifunova</span>
      <span
        aria-hidden
        className="hidden font-jp text-[11px] leading-none text-accent transition-transform sm:inline duration-300 ease-out-expo group-hover:-translate-y-0.5"
      >
        ワイフノヴァ
      </span>
    </Link>
  )
}
