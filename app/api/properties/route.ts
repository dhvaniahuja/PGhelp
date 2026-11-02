import { type NextRequest, NextResponse } from 'next/server'
import type { Gender, PropertyType, Sharing } from '@/lib/data/pg-listings'
import { getAllListings, getListingsByCollege, type SortKey } from '@/lib/services/pg-service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const college = searchParams.get('college')
  const type = searchParams.get('type')
  const gender = searchParams.get('gender')
  const sort = (searchParams.get('sort') as SortKey) || 'relevance'
  const query = searchParams.get('q')

  const filterOptions = {
    collegeSlug: college || undefined,
    types: type ? (type.split(',') as PropertyType[]) : undefined,
    gender: gender ? (gender as Gender | 'any') : undefined,
    query: query || undefined,
  }

  let listings = college
    ? await getListingsByCollege(college, filterOptions, sort)
    : await getAllListings()

  if (!college && query) {
    const q = query.toLowerCase()
    listings = listings.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q),
    )
  }

  return NextResponse.json({
    success: true,
    total: listings.length,
    data: listings,
  })
}
