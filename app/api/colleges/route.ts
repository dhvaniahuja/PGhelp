import { NextResponse } from 'next/server'
import { colleges } from '@/lib/colleges'
import { getListingsCountByCollege } from '@/lib/services/pg-service'

export async function GET() {
  const counts = await getListingsCountByCollege()
  const data = colleges.map((c) => ({
    ...c,
    listingsCount: counts[c.slug] || 0,
  }))

  return NextResponse.json({
    success: true,
    data,
  })
}
