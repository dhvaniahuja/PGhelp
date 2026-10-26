import { BedDouble, MapPin, Star, Users, UtensilsCrossed } from 'lucide-react'
import Image from 'next/image'
import {
  formatRupees,
  GENDER_LABELS,
  PROPERTY_TYPE_LABELS,
  type SampleListing,
} from '@/lib/sample-listings'

export function ListingCard({ listing, collegeShortName }: { listing: SampleListing; collegeShortName: string }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-foreground">
          {PROPERTY_TYPE_LABELS[listing.type]}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-background">
          Demo
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold">{listing.label}</h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground" title="Placeholder rating">
            <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
            <span className="sr-only">Placeholder rating:</span>
            {listing.demoRating.toFixed(1)}
          </p>
        </div>

        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5" aria-hidden="true" />~{listing.demoDistanceKm} km from {collegeShortName}
          <span className="text-xs">(placeholder)</span>
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <li className="flex items-center gap-1.5">
            <BedDouble className="size-4 text-muted-foreground" aria-hidden="true" />
            {listing.roomType}
          </li>
          <li className="flex items-center gap-1.5">
            <Users className="size-4 text-muted-foreground" aria-hidden="true" />
            {GENDER_LABELS[listing.gender]}
          </li>
          <li className="flex items-center gap-1.5">
            <UtensilsCrossed className="size-4 text-muted-foreground" aria-hidden="true" />
            {listing.foodIncluded ? 'Food included' : 'No food'}
          </li>
        </ul>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Amenities">
          {listing.amenities.map((amenity) => (
            <li key={amenity} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {amenity}
            </li>
          ))}
        </ul>

        <div className="flex-1" />
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
          <p>
            <span className="font-serif text-2xl font-medium">{formatRupees(listing.demoRent)}</span>
            <span className="text-sm text-muted-foreground"> /month</span>
            <span className="block text-xs text-muted-foreground">Demo price</span>
          </p>
          <span className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground">
            Details soon
          </span>
        </div>
      </div>
    </article>
  )
}
