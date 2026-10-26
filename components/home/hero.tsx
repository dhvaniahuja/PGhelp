import Image from 'next/image'
import { SearchPanel } from './search-panel'

export function Hero({ defaultType }: { defaultType: string }) {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-28 md:pb-16">
      <Image
        src="/images/bangalore-blossom-street.png"
        alt="A Bangalore road lined with pink tabebuia trees in bloom, petals on the ground and a city bus approaching"
        fill
        priority
        sizes="100vw"
        className="-z-20 scale-[1.06] object-cover object-[50%_40%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[oklch(0.18_0.04_330)]/90 via-[oklch(0.2_0.04_330)]/35 to-[oklch(0.2_0.04_330)]/30" aria-hidden="true" />

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white backdrop-blur">
          Bengaluru · Student stays
        </p>
        <h1 className="max-w-4xl text-balance font-serif text-5xl font-medium leading-[1.02] tracking-tight text-white md:text-7xl lg:text-8xl">
          Find your place in Bangalore.
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-lg text-white/85 md:text-xl">
          Your college. Your neighbourhood. Your next home.
        </p>

        <div className="mt-8 md:mt-10">
          <SearchPanel key={defaultType} defaultType={defaultType} />
        </div>

        <p className="mt-4 text-xs text-white/60">Photo: a blossom-lined Bangalore street in tabebuia season.</p>
      </div>
    </section>
  )
}
