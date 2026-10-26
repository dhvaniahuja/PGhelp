'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CollegeCombobox } from '@/components/college-combobox'
import { colleges } from '@/lib/colleges'

export function CollegeSwitcher({ currentSlug }: { currentSlug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <CollegeCombobox
      label="Switch college"
      colleges={colleges}
      value={currentSlug}
      onChange={(slug) => {
        if (slug === currentSlug) return
        const qs = searchParams.toString()
        router.push(`/colleges/${slug}${qs ? `?${qs}` : ''}`)
      }}
    />
  )
}
