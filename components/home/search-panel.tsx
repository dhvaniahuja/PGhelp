'use client'

import { ArrowRight, Building2, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CollegeCombobox } from '@/components/college-combobox'
import { SelectField } from '@/components/select-field'
import { colleges } from '@/lib/colleges'
import { BUDGET_OPTIONS, PROPERTY_TYPE_OPTIONS } from '@/lib/sample-listings'

export function SearchPanel({ defaultType = 'any' }: { defaultType?: string }) {
  const router = useRouter()
  const [college, setCollege] = useState<string | null>(null)
  const [type, setType] = useState(defaultType)
  const [budget, setBudget] = useState('any')
  const [showError, setShowError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!college) {
      setShowError(true)
      return
    }
    const params = new URLSearchParams()
    if (type !== 'any') params.set('type', type)
    if (budget !== 'any') params.set('budget', budget)
    const qs = params.toString()
    router.push(`/colleges/${college}${qs ? `?${qs}` : ''}`)
  }

  return (
    <form
      id="search"
      onSubmit={handleSubmit}
      aria-label="Find a stay near your college"
      className="scroll-mt-24 rounded-2xl border border-white/40 bg-card/95 p-4 shadow-2xl shadow-black/20 backdrop-blur md:p-5"
    >
      <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-end">
        <div>
          <CollegeCombobox
            colleges={colleges}
            value={college}
            invalid={showError && !college}
            onChange={(slug) => {
              setCollege(slug)
              setShowError(false)
            }}
          />
        </div>
        <SelectField
          label="Property type"
          value={type}
          options={PROPERTY_TYPE_OPTIONS}
          onChange={setType}
          icon={<Building2 className="size-4" />}
        />
        <SelectField
          label="Monthly budget"
          value={budget}
          options={BUDGET_OPTIONS}
          onChange={setBudget}
          icon={<Wallet className="size-4" />}
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
        >
          Find My Stay
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p role="alert" className="mt-3 text-sm text-destructive empty:hidden">
        {showError && !college ? 'Please choose your college to see nearby homes.' : ''}
      </p>
    </form>
  )
}
