'use client'

import { ArrowLeft, Building2, Heart, MapPin, Phone, Star, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { REAL_PG_LISTINGS, type PgListing } from '@/lib/data/pg-listings'
import { useSavedListings } from '@/lib/saved-listings'

export default function SavedListingsPage() {
  const { savedIds, isLoaded, toggleSave } = useSavedListings()
  const [savedListings, setSavedListings] = useState<PgListing[]>([])

  useEffect(() => {
    if (isLoaded) {
      const matched = REAL_PG_LISTINGS.filter((p) => savedIds.includes(p.id))
      setSavedListings(matched)
    }
  }, [savedIds, isLoaded])

  return (
    <>
      <SiteHeader />
      <main className="min-h-[80vh] bg-background pb-16 pt-8">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Home
            </Link>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <Heart className="size-5 fill-current" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-medium tracking-tight md:text-5xl">Your Saved PGs</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Saved locally on this device. Compare contact numbers and addresses before visiting.
                </p>
              </div>
            </div>
          </div>

          {!isLoaded ? (
            <div className="py-20 text-center text-sm text-muted-foreground">Loading your saved shortlist...</div>
          ) : savedListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <Heart className="mx-auto size-12 text-muted-foreground/40" />
              <h2 className="mt-4 font-serif text-2xl font-medium">No saved stays yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Click the heart icon on any PG card to bookmark it for quick access here.
              </p>
              <Link
                href="/#colleges"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse Colleges & Stays
              </Link>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {savedListings.length} {savedListings.length === 1 ? 'Stay' : 'Stays'} saved
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {savedListings.map((listing) => (
                  <article
                    key={listing.id}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                          {listing.genderLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSave(listing.id)}
                          title="Remove from saved"
                          className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <h2 className="mt-3 font-serif text-xl font-medium leading-snug">
                        <Link href={`/listings/${listing.id}`} className="hover:text-primary">
                          {listing.name}
                        </Link>
                      </h2>

                      <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <span className="line-clamp-2">{listing.address}</span>
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs">
                        <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                          Near {listing.collegeShortName}
                        </span>
                        {listing.googleMapsRating && (
                          <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                            <Star className="size-3 fill-current" />
                            {listing.googleMapsRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      {listing.phone ? (
                        <a
                          href={`tel:${listing.phone}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <Phone className="size-3.5" />
                          {listing.phone}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">Phone on request</span>
                      )}

                      <Link
                        href={`/listings/${listing.id}`}
                        className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:bg-foreground/90"
                      >
                        View Details →
                      </Link>
                    </div>
                  </article>
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
