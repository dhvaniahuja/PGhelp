'use client'

import { ArrowUpDown, SlidersHorizontal, X } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { SelectField } from '@/components/select-field'
import {
  AMENITIES,
  type Amenity,
  formatRupees,
  type Gender,
  GENDER_LABELS,
  PROPERTY_TYPE_LABELS,
  type PropertyType,
  RENT_MAX,
  RENT_MIN,
  type SampleListing,
  type Sharing,
  SHARING_LABELS,
} from '@/lib/sample-listings'
import { cn } from '@/lib/utils'
import { ListingCard } from './listing-card'

type FoodFilter = 'any' | 'included' | 'not-included'
type SortKey = 'relevance' | 'rent-asc' | 'rent-desc' | 'distance' | 'rating'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Recommended' },
  { value: 'rent-asc', label: 'Rent: low to high' },
  { value: 'rent-desc', label: 'Rent: high to low' },
  { value: 'distance', label: 'Nearest first' },
  { value: 'rating', label: 'Top rated' },
] as const

type Filters = {
  maxRent: number
  types: PropertyType[]
  gender: Gender | 'any'
  sharing: Sharing[]
  food: FoodFilter
  amenities: Amenity[]
}

function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
}

type ResultsViewProps = {
  listings: SampleListing[]
  collegeShortName: string
  initialType: PropertyType | null
  initialBudget: number | null
}

export function ResultsView({ listings, collegeShortName, initialType, initialBudget }: ResultsViewProps) {
  const defaults: Filters = {
    maxRent: RENT_MAX,
    types: [],
    gender: 'any',
    sharing: [],
    food: 'any',
    amenities: [],
  }
  const [filters, setFilters] = useState<Filters>({
    ...defaults,
    maxRent: initialBudget ? Math.min(initialBudget, RENT_MAX) : RENT_MAX,
    types: initialType ? [initialType] : [],
  })
  const [sort, setSort] = useState<SortKey>('relevance')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const results = useMemo(() => {
    const matched = listings.filter(
      (l) =>
        l.demoRent <= filters.maxRent &&
        (filters.types.length === 0 || filters.types.includes(l.type)) &&
        (filters.gender === 'any' || l.gender === filters.gender) &&
        (filters.sharing.length === 0 || filters.sharing.includes(l.sharing)) &&
        (filters.food === 'any' || (filters.food === 'included') === l.foodIncluded) &&
        filters.amenities.every((a) => l.amenities.includes(a)),
    )
    const sorted = [...matched]
    if (sort === 'rent-asc') sorted.sort((a, b) => a.demoRent - b.demoRent)
    if (sort === 'rent-desc') sorted.sort((a, b) => b.demoRent - a.demoRent)
    if (sort === 'distance') sorted.sort((a, b) => a.demoDistanceKm - b.demoDistanceKm)
    if (sort === 'rating') sorted.sort((a, b) => b.demoRating - a.demoRating)
    return sorted
  }, [listings, filters, sort])

  const activeCount =
    (filters.maxRent < RENT_MAX ? 1 : 0) +
    filters.types.length +
    (filters.gender !== 'any' ? 1 : 0) +
    filters.sharing.length +
    (filters.food !== 'any' ? 1 : 0) +
    filters.amenities.length

  const reset = () => setFilters(defaults)

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls="filters-panel"
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filters {activeCount > 0 && `(${activeCount})`}
          </span>
          {filtersOpen ? <X className="size-4" aria-hidden="true" /> : null}
        </button>

        <div
          id="filters-panel"
          className={cn(
            'mt-3 flex-col gap-7 rounded-2xl border border-border bg-card p-5 lg:mt-0 lg:flex',
            filtersOpen ? 'flex' : 'hidden',
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Filters</h2>
            <button
              type="button"
              onClick={reset}
              disabled={activeCount === 0}
              className="text-sm text-primary underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              Reset
            </button>
          </div>

          <RentSlider value={filters.maxRent} onChange={(maxRent) => setFilters((f) => ({ ...f, maxRent }))} />

          <ChipGroup
            legend="Property type"
            options={Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]}
            isActive={(v) => filters.types.includes(v)}
            onToggle={(v) => setFilters((f) => ({ ...f, types: toggle(f.types, v) }))}
          />

          <ChipGroup
            legend="Gender"
            options={[['any', 'Any'], ...(Object.entries(GENDER_LABELS) as [Gender, string][])]}
            isActive={(v) => filters.gender === v}
            onToggle={(v) => setFilters((f) => ({ ...f, gender: v }))}
            single
          />

          <ChipGroup
            legend="Sharing"
            options={Object.entries(SHARING_LABELS) as [Sharing, string][]}
            isActive={(v) => filters.sharing.includes(v)}
            onToggle={(v) => setFilters((f) => ({ ...f, sharing: toggle(f.sharing, v) }))}
          />

          <ChipGroup
            legend="Food"
            options={[
              ['any', 'Any'],
              ['included', 'Included'],
              ['not-included', 'Not included'],
            ]}
            isActive={(v) => filters.food === v}
            onToggle={(v) => setFilters((f) => ({ ...f, food: v as FoodFilter }))}
            single
          />

          <fieldset>
            <legend className="mb-3 text-sm font-medium">Amenities</legend>
            <div className="flex flex-col gap-2.5">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => setFilters((f) => ({ ...f, amenities: toggle(f.amenities, amenity) }))}
                    className="size-4 accent-[var(--primary)]"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </aside>

      <section aria-labelledby="results-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="results-heading" className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-semibold text-foreground">{results.length}</span> of {listings.length} sample
            listings
          </h2>
          <SelectField
            label="Sort by"
            value={sort}
            options={SORT_OPTIONS}
            onChange={(v) => setSort(v as SortKey)}
            icon={<ArrowUpDown className="size-4" />}
            className="sm:w-56"
          />
        </div>

        {results.length > 0 ? (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((listing) => (
              <li key={listing.id} className="flex">
                <ListingCard listing={listing} collegeShortName={collegeShortName} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="font-serif text-2xl">No sample homes match these filters.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a higher budget or fewer amenities.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function RentSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const id = useId()
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          Max monthly rent
        </label>
        <span className="text-sm text-muted-foreground">{value >= RENT_MAX ? 'Any' : formatRupees(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={RENT_MIN}
        max={RENT_MAX}
        step={500}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={value >= RENT_MAX ? 'Any rent' : formatRupees(value)}
        className="w-full accent-[var(--primary)]"
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{formatRupees(RENT_MIN)}</span>
        <span>{formatRupees(RENT_MAX)}+</span>
      </div>
    </div>
  )
}

function ChipGroup<T extends string>({
  legend,
  options,
  isActive,
  onToggle,
  single,
}: {
  legend: string
  options: [T, string][]
  isActive: (value: T) => boolean
  onToggle: (value: T) => void
  single?: boolean
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2" role={single ? 'radiogroup' : undefined}>
        {options.map(([value, label]) => {
          const active = isActive(value)
          return (
            <button
              key={value}
              type="button"
              role={single ? 'radio' : undefined}
              aria-checked={single ? active : undefined}
              aria-pressed={single ? undefined : active}
              onClick={() => onToggle(value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-foreground/30',
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
