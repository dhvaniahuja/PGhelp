import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

type Option = { value: string; label: string }

type SelectFieldProps = {
  label: string
  value: string
  options: readonly Option[]
  onChange: (value: string) => void
  icon?: React.ReactNode
  className?: string
}

export function SelectField({ label, value, options, onChange, icon, className }: SelectFieldProps) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="relative flex h-12 items-center rounded-lg border border-input bg-card transition-colors focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20">
        {icon && (
          <span className="pointer-events-none absolute left-3 text-muted-foreground" aria-hidden="true">
            {icon}
          </span>
        )}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-full w-full cursor-pointer appearance-none bg-transparent pr-9 text-sm text-foreground outline-none',
            icon ? 'pl-9' : 'pl-3',
          )}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </div>
  )
}
