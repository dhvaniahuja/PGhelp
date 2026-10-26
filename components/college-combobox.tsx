'use client'

import { Check, ChevronDown, GraduationCap } from 'lucide-react'
import { useId, useMemo, useRef, useState } from 'react'
import type { College } from '@/lib/colleges'
import { cn } from '@/lib/utils'

type CollegeComboboxProps = {
  colleges: College[]
  value: string | null
  onChange: (slug: string) => void
  label?: string
  invalid?: boolean
  className?: string
}

export function CollegeCombobox({
  colleges,
  value,
  onChange,
  label = 'College',
  invalid,
  className,
}: CollegeComboboxProps) {
  const id = useId()
  const listboxId = `${id}-listbox`
  const inputRef = useRef<HTMLInputElement>(null)
  const selected = colleges.find((c) => c.slug === value) ?? null

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return colleges
    return colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q),
    )
  }, [colleges, query])

  function openList() {
    setOpen(true)
    setQuery('')
    const idx = colleges.findIndex((c) => c.slug === value)
    setActiveIndex(idx >= 0 ? idx : 0)
  }

  function choose(college: College) {
    onChange(college.slug)
    setOpen(false)
    setQuery('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) return openList()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      if (open && filtered[activeIndex]) {
        e.preventDefault()
        choose(filtered[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  const activeOption = open ? filtered[activeIndex] : undefined

  return (
    <div className={cn('relative', className)}>
      <label htmlFor={`${id}-input`} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div
        className={cn(
          'flex h-12 items-center gap-2 rounded-lg border bg-card px-3 transition-colors focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20',
          invalid ? 'border-destructive' : 'border-input',
        )}
      >
        <GraduationCap className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={invalid || undefined}
          aria-activedescendant={activeOption ? `${id}-${activeOption.slug}` : undefined}
          autoComplete="off"
          placeholder="Search your college"
          value={open ? query : (selected?.name ?? '')}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(0)
            if (!open) setOpen(true)
          }}
          onFocus={openList}
          onClick={() => !open && openList()}
          onBlur={() => {
            setOpen(false)
            setQuery('')
          }}
          onKeyDown={handleKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <ChevronDown
          className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </div>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Bangalore colleges"
          onMouseDown={(e) => e.preventDefault()}
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-auto rounded-lg border border-border bg-popover p-1 shadow-xl"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-3 text-sm text-muted-foreground">No matching college yet.</li>
          ) : (
            filtered.map((college, index) => {
              const isSelected = college.slug === value
              return (
                <li
                  key={college.slug}
                  id={`${id}-${college.slug}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(college)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm',
                    index === activeIndex && 'bg-secondary text-secondary-foreground',
                  )}
                >
                  <span className="flex flex-col">
                    <span className="font-medium">{college.name}</span>
                    <span className="text-xs text-muted-foreground">{college.area}</span>
                  </span>
                  {isSelected && <Check className="size-4 text-primary" aria-hidden="true" />}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
