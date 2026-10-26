import { CitySection } from '@/components/home/city-section'
import { CollegeGrid } from '@/components/home/college-grid'
import { Hero } from '@/components/home/hero'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

const VALID_TYPES = ['pg', 'hostel', 'flat']

export default async function HomePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams
  const defaultType = type && VALID_TYPES.includes(type) ? type : 'any'

  return (
    <>
      <SiteHeader variant="overlay" />
      <main>
        <Hero defaultType={defaultType} />
        <CollegeGrid />
        <CitySection />
      </main>
      <SiteFooter />
    </>
  )
}
