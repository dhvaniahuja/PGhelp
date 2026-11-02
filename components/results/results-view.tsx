'use client'

import { ArrowUpDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { SelectField } from '@/components/select-field'
import type { Gender, PgListing, PropertyType, Sharing } from '@/lib/data/pg-listings'
import {
  AMENITIES,
  formatRupees,
  GENDER_LABELS,
  PROPERTY_TYPE_LABELS,
  RENT_MAX,
  RENT_MIN,
  SHARING_LABELS,
} from '@/lib/sample-listings'
import { cn } from '@/lib/utils'
import { ListingCard } from './listing-card'

type FoodFilter = 'any' | 'included' | 'not-included'
type SortKey = 'relevance' | 'rating' | 'distance' | 'rent-asc' | 'rent-desc' | 'name-asc'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Recommended' },
  { value: 'rating', label: 'Top Google Rating' },
  { value: 'distance', label: 'Nearest to campus' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'rent-asc', label: 'Rent: low to high' },
  { value: 'rent-desc', label: 'Rent: high to low' },
] as const

type Filters = {
  searchQuery: string
  maxRent: number
  types: PropertyType[]
  gender: Gender | 'any'
  sharing: Sharing[]
  food: FoodFilter
  amenities: string[]
}

function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
}

type ResultsViewProps = {
  listings: PgListing[]
  collegeShortName: string
  initialType?: PropertyType | null
  initialBudget?: number | null
}

export function ResultsView({ listings, collegeShortName, initialType, initialBudget }: ResultsViewProps) {
  const defaults: Filters = {
    searchQuery: '',
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
    const q = filters.searchQuery.trim().toLowerCase()

    const matched = listings.filter((l) => {
      // 1. Text search by PG name or address
      if (q) {
        const matchesText =
          l.name.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q)
        if (!matchesText) return false
      }

      // 2. Rent (only if rent is specified and maxRent is adjusted below RENT_MAX)
      if (filters.maxRent < RENT_MAX && l.rent !== null) {
        if (l.rent > filters.maxRent) return false
      }

      // 3. Property Type
      if (filters.types.length > 0 && !filters.types.includes(l.type)) {
        return false
      }

      // 4. Gender
      if (filters.gender !== 'any') {
        if (l.gender !== filters.gender && l.gender !== 'co-living') {
          return false
        }
      }

      // 5. Sharing
      if (filters.sharing.length > 0 && l.sharing) {
        if (!filters.sharing.includes(l.sharing)) return false
      }

      // 6. Food
      if (filters.food !== 'any' && l.foodIncluded !== null) {
        const matchesFood = (filters.food === 'included') === l.foodIncluded
        if (!matchesFood) return false
      }

      // 7. Amenities
      if (filters.amenities.length > 0 && l.amenities.length > 0) {
        const hasAll = filters.amenities.every((a) => l.amenities.includes(a))
        if (!hasAll) return false
      }

      return true
    })

    const sorted = [...matched]
    if (sort === 'rating') {
      sorted.sort((a, b) => (b.googleMapsRating ?? 0) - (a.googleMapsRating ?? 0))
    } else if (sort === 'distance') {
      sorted.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
    } else if (sort === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'rent-asc') {
      sorted.sort((a, b) => (a.rent ?? 999999) - (b.rent ?? 999999))
    } else if (sort === 'rent-desc') {
      sorted.sort((a, b) => (b.rent ?? 0) - (a.rent ?? 0))
    } else {
      // Relevance: sort by rating where available
      sorted.sort((a, b) => (b.googleMapsRating ?? 0) - (a.googleMapsRating ?? 0))
    }

    return sorted
  }, [listings, filters, sort])

  const activeCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.maxRent < RENT_MAX ? 1 : 0) +
    filters.types.length +
    (filters.gender !== 'any' ? 1 : 0) +
    filters.sharing.length +
    (filters.food !== 'any' ? 1 : 0) +
    filters.amenities.length

  const reset = () => setFilters(defaults)

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      {/* Filters Sidebar */}
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
            'mt-3 flex-col gap-6 rounded-2xl border border-border bg-card p-5 lg:mt-0 lg:flex shadow-sm',
            filtersOpen ? 'flex' : 'hidden',
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Filter Results</h2>
            <button
              type="button"
              onClick={reset}
              disabled={activeCount === 0}
              className="text-sm text-primary underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              Reset
            </button>
          </div>

          {/* Search by PG Name or Location */}
          <div>
            <label htmlFor="filter-search" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Search by name
            </label>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:border-primary">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                id="filter-search"
                type="text"
                placeholder="e.g. Paradise, Sattvam..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((f) => ({ ...f, searchQuery: e.target.value }))}
                className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, searchQuery: '' }))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Gender Filter */}
          <ChipGroup
            legend="Gender"
            options={[['any', 'Any'], ...(Object.entries(GENDER_LABELS) as [Gender, string][])]}
            isActive={(v) => filters.gender === v}
            onToggle={(v) => setFilters((f) => ({ ...f, gender: v }))}
            single
          />

          {/* Property Type Filter */}
          <ChipGroup
            legend="Property type"
            options={Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]}
            isActive={(v) => filters.types.includes(v)}
            onToggle={(v) => setFilters((f) => ({ ...f, types: toggle(f.types, v) }))}
          />

          {/* Max Rent Slider */}
          <RentSlider value={filters.maxRent} onChange={(maxRent) => setFilters((f) => ({ ...f, maxRent }))} />

          {/* Room Sharing Filter */}
          <ChipGroup
            legend="Room sharing"
            options={Object.entries(SHARING_LABELS) as [Sharing, string][]}
            isActive={(v) => filters.sharing.includes(v)}
            onToggle={(v) => setFilters((f) => ({ ...f, sharing: toggle(f.sharing, v) }))}
          />

          {/* Food Filter */}
          <ChipGroup
            legend="Food policy"
            options={[
              ['any', 'Any'],
              ['included', 'Included'],
              ['not-included', 'Not included'],
            ]}
            isActive={(v) => filters.food === v}
            onToggle={(v) => setFilters((f) => ({ ...f, food: v as FoodFilter }))}
            single
          />

          {/* Amenities Filter */}
          <fieldset>
            <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Amenities
            </legend>
            <div className="flex flex-col gap-2">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex cursor-pointer items-center gap-2.5 text-xs">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => setFilters((f) => ({ ...f, amenities: toggle(f.amenities, amenity) }))}
                    className="size-3.5 accent-[var(--primary)]"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </aside>

      {/* Results Main Section */}
      <section aria-labelledby="results-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="results-heading" className="text-sm text-muted-foreground" aria-live="polite">
              Showing <span className="font-semibold text-foreground">{results.length}</span> of{' '}
              {listings.length} verified stays near {collegeShortName}
            </h2>
          </div>
          <SelectField
            label="Sort by"
            value={sort}
            options={SORT_OPTIONS}
            onChange={(v) => setSort(v as SortKey)}
            icon={<ArrowUpDown className="size-4" />}
            className="sm:w-60"
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
            <p className="font-serif text-2xl font-medium">No PGs match these filters.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try choosing &quot;Any&quot; gender or resetting your search keyword.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Reset all filters
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
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Max monthly rent
        </label>
        <span className="text-xs font-semibold">{value >= RENT_MAX ? 'Any' : formatRupees(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={RENT_MIN}
        max={RENT_MAX}
        step={500}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
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
      <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{legend}</legend>
      <div className="flex flex-wrap gap-1.5" role={single ? 'radiogroup' : undefined}>
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
                'rounded-full border px-3 py-1 text-xs transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground font-medium'
                  : 'border-border bg-background hover:border-foreground/30 text-foreground',
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
