import { ArrowUpRight, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { colleges } from '@/lib/colleges'

export function CollegeGrid() {
  return (
    <section id="colleges" aria-labelledby="colleges-heading" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Browse by campus</p>
            <h2 id="colleges-heading" className="mt-2 max-w-xl text-balance font-serif text-4xl font-medium tracking-tight md:text-5xl">
              Start with where you study.
            </h2>
          </div>
          <p className="max-w-sm text-pretty text-muted-foreground">
            Pick a campus to see homes organised around your daily commute — not around a pin on a map.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {colleges.map((college) => (
            <li key={college.slug}>
              <Link
                href={`/colleges/${college.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={college.image}
                    alt={college.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <h3 className="font-semibold leading-snug">{college.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {college.area}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
