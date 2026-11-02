import { REAL_PG_LISTINGS, type Gender, type PgListing, type PropertyType, type Sharing } from '@/lib/data/pg-listings'

export interface ListingFilterOptions {
  collegeSlug?: string
  types?: PropertyType[]
  gender?: Gender | 'any'
  sharing?: Sharing[]
  food?: 'any' | 'included' | 'not-included'
  amenities?: string[]
  maxRent?: number
  query?: string
}

export type SortKey = 'relevance' | 'rating' | 'distance' | 'rent-asc' | 'rent-desc' | 'name-asc'

/**
 * Service Layer abstraction for PG Listings.
 * All frontend components query through this service so a future Supabase
 * or external REST backend can be plugged in by updating only these service methods.
 */
export async function getAllListings(): Promise<PgListing[]> {
  return [...REAL_PG_LISTINGS]
}

export async function getListingById(id: string): Promise<PgListing | null> {
  const match = REAL_PG_LISTINGS.find((p) => p.id === id)
  return match ? { ...match } : null
}

export async function getListingsByCollege(
  collegeSlug: string,
  filters?: ListingFilterOptions,
  sort: SortKey = 'relevance',
): Promise<PgListing[]> {
  let listings = REAL_PG_LISTINGS.filter((p) => p.collegeSlug === collegeSlug)

  if (filters) {
    listings = applyFilters(listings, filters)
  }

  return sortListings(listings, sort)
}

export async function searchListings(query: string, filters?: ListingFilterOptions): Promise<PgListing[]> {
  const q = query.trim().toLowerCase()
  let listings = REAL_PG_LISTINGS

  if (q) {
    listings = listings.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.collegeName.toLowerCase().includes(q) ||
        p.collegeShortName.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q),
    )
  }

  if (filters) {
    listings = applyFilters(listings, filters)
  }

  return listings
}

export async function getListingsCountByCollege(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {}
  for (const item of REAL_PG_LISTINGS) {
    counts[item.collegeSlug] = (counts[item.collegeSlug] || 0) + 1
  }
  return counts
}

function applyFilters(listings: PgListing[], filters: ListingFilterOptions): PgListing[] {
  return listings.filter((item) => {
    // 1. Property Type
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(item.type)) return false
    }

    // 2. Gender Preference
    if (filters.gender && filters.gender !== 'any') {
      if (item.gender !== filters.gender && item.gender !== 'co-living') return false
    }

    // 3. Sharing
    if (filters.sharing && filters.sharing.length > 0) {
      if (item.sharing && !filters.sharing.includes(item.sharing)) return false
    }

    // 4. Food
    if (filters.food && filters.food !== 'any') {
      const wantFood = filters.food === 'included'
      if (item.foodIncluded !== null && item.foodIncluded !== wantFood) return false
    }

    // 5. Amenities
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((a) => item.amenities.includes(a))
      if (!hasAll && item.amenities.length > 0) return false
    }

    // 6. Max Rent (if rent is recorded for the listing)
    if (typeof filters.maxRent === 'number' && filters.maxRent > 0) {
      if (item.rent !== null && item.rent > filters.maxRent) return false
    }

    // 7. General search term
    if (filters.query) {
      const q = filters.query.trim().toLowerCase()
      const matches =
        item.name.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q)
      if (!matches) return false
    }

    return true
  })
}

function sortListings(listings: PgListing[], sort: SortKey): PgListing[] {
  const sorted = [...listings]

  switch (sort) {
    case 'rating':
      return sorted.sort((a, b) => (b.googleMapsRating ?? 0) - (a.googleMapsRating ?? 0))

    case 'distance':
      return sorted.sort((a, b) => {
        const distA = a.distanceKm ?? 999
        const distB = b.distanceKm ?? 999
        return distA - distB
      })

    case 'rent-asc':
      return sorted.sort((a, b) => {
        const rentA = a.rent ?? 999999
        const rentB = b.rent ?? 999999
        return rentA - rentB
      })

    case 'rent-desc':
      return sorted.sort((a, b) => (b.rent ?? 0) - (a.rent ?? 0))

    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))

    case 'relevance':
    default:
      // Sort by rating with valid distance prioritizing
      return sorted.sort((a, b) => {
        if (a.googleMapsRating && b.googleMapsRating) {
          return b.googleMapsRating - a.googleMapsRating
        }
        return 0
      })
  }
}
