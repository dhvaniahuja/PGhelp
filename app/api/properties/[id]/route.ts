import { type NextRequest, NextResponse } from 'next/server'
import { getListingById } from '@/lib/services/pg-service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const listing = await getListingById(id)

  if (!listing) {
    return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: listing,
  })
}
