'use client'

import { BedDouble, Heart, MapPin, Phone, Star, Users, UtensilsCrossed } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { PgListing } from '@/lib/data/pg-listings'
import { useSavedListings } from '@/lib/saved-listings'
import { cn } from '@/lib/utils'

export function ListingCard({ listing, collegeShortName }: { listing: PgListing; collegeShortName: string }) {
  const { isSaved, toggleSave } = useSavedListings()
  const saved = isSaved(listing.id)

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] bg-muted">
        {listing.image ? (
          <Image
            src={listing.image}
            alt={listing.imageAlt || listing.name}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-secondary/80 to-muted p-6 text-center">
            <span className="font-serif text-3xl text-primary/30">PG HELP</span>
            <span className="mt-2 text-xs font-medium text-muted-foreground">Photo verification in progress</span>
            <span className="mt-0.5 text-[11px] text-muted-foreground/75">Verified address & contact available</span>
          </div>
        )}

        {/* Top Badges */}
        <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-foreground shadow-sm">
          {listing.genderLabel || 'Student Stay'}
        </span>

        {/* Save/Favorite Heart Button */}
        <button
          type="button"
          onClick={() => toggleSave(listing.id)}
          aria-label={saved ? 'Remove from saved' : 'Save to favourites'}
          className={cn(
            'absolute right-3 top-3 flex size-8 items-center justify-center rounded-full backdrop-blur transition-all shadow-sm',
            saved
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80'
              : 'bg-card/90 text-muted-foreground hover:bg-card hover:text-foreground',
          )}
        >
          <Heart className={cn('size-4', saved && 'fill-current text-rose-600')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug">
            <Link href={`/listings/${listing.id}`} className="hover:text-primary">
              {listing.name}
            </Link>
          </h3>
          {listing.googleMapsRating ? (
            <p
              className="flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              title="Google Maps rating from public listing"
            >
              <Star className="size-3 fill-amber-500 text-amber-500" aria-hidden="true" />
              <span>{listing.googleMapsRating.toFixed(1)}</span>
            </p>
          ) : null}
        </div>

        {/* Distance & Address */}
        <p className="mt-1.5 flex items-start gap-1 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span className="line-clamp-1">{listing.address}</span>
        </p>

        {listing.distanceNote ? (
          <p className="mt-1 text-xs font-medium text-primary">📍 {listing.distanceNote}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">Located in {listing.area}</p>
        )}

        {/* Details Pills */}
        <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
          <li className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-muted-foreground">
            <Users className="size-3" aria-hidden="true" />
            {listing.genderLabel}
          </li>
          {listing.roomType ? (
            <li className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-muted-foreground">
              <BedDouble className="size-3" aria-hidden="true" />
              {listing.roomType}
            </li>
          ) : null}
          {listing.foodIncluded !== null ? (
            <li className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-muted-foreground">
              <UtensilsCrossed className="size-3" aria-hidden="true" />
              {listing.foodIncluded ? 'Food included' : 'No food'}
            </li>
          ) : null}
          {listing.phone && (
            <li className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Phone className="size-3" aria-hidden="true" />
              Call available
            </li>
          )}
        </ul>

        <div className="flex-1" />

        {/* Bottom Pricing & Action Link */}
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-3">
          <div>
            <p className="font-serif text-lg font-medium">
              {listing.rent ? `₹${listing.rent.toLocaleString('en-IN')}` : 'Contact for Rent'}
              {listing.rent && <span className="text-xs font-sans text-muted-foreground"> /month</span>}
            </p>
            <span className="block text-[11px] text-muted-foreground">
              {listing.rent ? 'Monthly rent' : 'Call manager for rates'}
            </span>
          </div>

          <Link
            href={`/listings/${listing.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            View Details →
          </Link>
        </div>
      </div>
    </article>
  )
}
