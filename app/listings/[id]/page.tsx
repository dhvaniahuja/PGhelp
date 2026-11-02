import {
  ArrowLeft,
  Building2,
  ExternalLink,
  GraduationCap,
  Info,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ListingDetailActions } from '@/components/listing-detail-actions'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { REAL_PG_LISTINGS } from '@/lib/data/pg-listings'
import { getListingById, getListingsByCollege } from '@/lib/services/pg-service'

type Props = {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return REAL_PG_LISTINGS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) return {}
  return {
    title: `${listing.name} near ${listing.collegeShortName} — PG HELP`,
    description: `${listing.name}, student accommodation near ${listing.collegeName}, ${listing.area}, Bangalore. Contact: ${listing.phone || 'Available online'}.`,
  }
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) notFound()

  const nearbyListings = (await getListingsByCollege(listing.collegeSlug))
    .filter((p) => p.id !== listing.id)
    .slice(0, 3)

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pb-16">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-border bg-card/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
            <Link
              href={`/colleges/${listing.collegeSlug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to {listing.collegeShortName} stays
            </Link>
            <span className="text-xs text-muted-foreground">ID: {listing.id}</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          {/* Main Grid: Left Details, Right Action Panel */}
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Header Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                    <Users className="size-3" />
                    {listing.genderLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                    <GraduationCap className="size-3" />
                    Near {listing.collegeShortName}
                  </span>
                  {listing.googleMapsRating ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      {listing.googleMapsRating.toFixed(1)} on Google Maps
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground md:text-5xl">
                  {listing.name}
                </h1>

                <p className="mt-3 flex items-start gap-2 text-base text-muted-foreground">
                  <MapPin className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{listing.address}</span>
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={listing.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4 hover:opacity-80"
                  >
                    Open in Google Maps
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                  {listing.distanceNote && (
                    <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                      📍 {listing.distanceNote}
                    </span>
                  )}
                </div>
              </div>

              {/* Research & Verification Notes Banner */}
              <div className="rounded-2xl border border-border bg-secondary/50 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <h2 className="font-semibold text-foreground">Listing Information & Source</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {listing.verificationNotes}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground/80">
                      Source: {listing.source} · Verified contact and address as researched for Bangalore students.
                    </p>
                  </div>
                </div>
              </div>

              {/* Overview & Room Specifications */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="font-serif text-xl font-medium">Property Details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Gender Category</p>
                    <p className="mt-1 text-base font-semibold">{listing.genderLabel}</p>
                    <p className="text-xs text-muted-foreground">Suitable for students and working professionals</p>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Monthly Rent</p>
                    <p className="mt-1 text-base font-semibold">
                      {listing.rent ? `₹${listing.rent.toLocaleString('en-IN')} /month` : 'Contact for exact rent'}
                    </p>
                    <p className="text-xs text-muted-foreground">Varies by occupancy (single/double/triple sharing)</p>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Nearest Campus</p>
                    <p className="mt-1 text-base font-semibold">{listing.collegeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {listing.distanceNote || `${listing.area}, Bangalore`}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Phone Contact</p>
                    <p className="mt-1 text-base font-semibold">
                      {listing.phone ? (
                        <a href={`tel:${listing.phone}`} className="text-primary hover:underline">
                          {listing.phone}
                        </a>
                      ) : (
                        'Inquire directly via map link'
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Direct contact recorded from business listing</p>
                  </div>
                </div>
              </div>

              {/* Honest Transparency Notice */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="text-sm">
                    <h3 className="font-semibold">PG Help Verification Notice</h3>
                    <p className="mt-1 leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                      To keep listings 100% honest, we do not invent fake room photos or estimated rents. Please call
                      the manager or visit the property in person with a parent/guardian to inspect room condition, food
                      timings, security deposit, and curfew rules before paying any advance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Action Panel */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Direct Contact</p>
                <h2 className="mt-1 font-serif text-2xl font-medium">Connect with {listing.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Call the owner directly or save this stay to your shortlist to compare later.
                </p>

                <div className="mt-6">
                  <ListingDetailActions listing={listing} />
                </div>
              </div>
            </div>
          </div>

          {/* Related Listings near same campus */}
          {nearbyListings.length > 0 && (
            <div className="mt-16 border-t border-border pt-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">Explore More</p>
                  <h2 className="mt-1 font-serif text-3xl font-medium">Other stays near {listing.collegeShortName}</h2>
                </div>
                <Link
                  href={`/colleges/${listing.collegeSlug}`}
                  className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  View all ({nearbyListings.length + 1}) →
                </Link>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {nearbyListings.map((nearby) => (
                  <Link
                    key={nearby.id}
                    href={`/listings/${nearby.id}`}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                          {nearby.genderLabel}
                        </span>
                        {nearby.googleMapsRating && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                            <Star className="size-3 fill-primary text-primary" />
                            {nearby.googleMapsRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary">{nearby.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{nearby.address}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                      <span className="text-muted-foreground">{nearby.phone || 'Phone on request'}</span>
                      <span className="font-semibold text-primary group-hover:underline">View details →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
