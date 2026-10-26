import { ArrowLeft, Info, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { CollegeSwitcher } from '@/components/results/college-switcher'
import { ResultsView } from '@/components/results/results-view'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { colleges, getCollege } from '@/lib/colleges'
import { getSampleListings, type PropertyType } from '@/lib/sample-listings'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ type?: string; budget?: string }>
}

export function generateStaticParams() {
  return colleges.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const college = getCollege(slug)
  if (!college) return {}
  return {
    title: `Stays near ${college.name} — PG HELP`,
    description: `PGs, hostels and flats near ${college.name}, ${college.area}, Bangalore.`,
  }
}

const VALID_TYPES: PropertyType[] = ['pg', 'hostel', 'flat']

export default async function CollegePage({ params, searchParams }: Props) {
  const [{ slug }, { type, budget }] = await Promise.all([params, searchParams])
  const college = getCollege(slug)
  if (!college) notFound()

  const collegeIndex = colleges.findIndex((c) => c.slug === slug)
  const initialType = VALID_TYPES.includes(type as PropertyType) ? (type as PropertyType) : null
  const budgetNumber = Number(budget)
  const initialBudget = Number.isFinite(budgetNumber) && budgetNumber > 0 ? budgetNumber : null

  return (
    <>
      <SiteHeader />
      <main>
        <section aria-labelledby="college-heading" className="border-b border-border">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_1fr] md:items-center md:px-8 md:py-14">
            <div>
              <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to search
              </Link>
              <p className="mt-6 text-xs font-medium uppercase tracking-widest text-primary">Homes near</p>
              <h1 id="college-heading" className="mt-2 text-balance font-serif text-4xl font-medium tracking-tight md:text-6xl">
                {college.name}
              </h1>
              <p className="mt-3 flex items-start gap-1.5 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {college.location}
              </p>
              <div className="mt-8 max-w-md">
                <Suspense fallback={<div className="h-[4.25rem]" />}>
                  <CollegeSwitcher key={college.slug} currentSlug={college.slug} />
                </Suspense>
              </div>
            </div>

            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={college.image}
                  alt={college.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-xs text-muted-foreground">
                Photo:{' '}
                <a href={college.imageSource} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  {college.imageCredit}
                </a>{' '}
                via Wikimedia Commons, {college.imageLicense}
              </figcaption>
            </figure>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <p className="mb-8 flex items-start gap-2 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            These are sample/demo listings to preview the experience near {college.shortName}. Prices, ratings and
            distances are placeholders, not real properties.
          </p>
          <ResultsView
            key={college.slug}
            listings={getSampleListings(collegeIndex)}
            collegeShortName={college.shortName}
            initialType={initialType}
            initialBudget={initialBudget}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
