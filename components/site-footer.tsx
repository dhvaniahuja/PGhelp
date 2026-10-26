import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <Link href="/" className="font-serif text-2xl font-semibold">
            PG HELP
          </Link>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-background/70">
            Student stays across Bangalore, organised by campus. All listings shown in this prototype are sample/demo
            content — not real properties, prices or availability.
          </p>
        </div>
        <p className="text-xs text-background/60">
          Campus photographs via Wikimedia Commons, credited on each college page.
        </p>
      </div>
    </footer>
  )
}
