'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/?type=pg#search', label: 'Explore PGs' },
  { href: '/?type=flat#search', label: 'Explore Flats' },
  { href: '/#colleges', label: 'Colleges' },
]

export function SiteHeader({ variant = 'solid' }: { variant?: 'overlay' | 'solid' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [comingSoon, setComingSoon] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const overlay = variant === 'overlay'

  function showComingSoon(feature: string) {
    setComingSoon(feature)
    setMenuOpen(false)
    dialogRef.current?.showModal()
  }

  return (
    <header
      className={cn(
        'z-40 w-full',
        overlay ? 'absolute inset-x-0 top-0 text-white' : 'sticky top-0 border-b border-border bg-background/90 backdrop-blur',
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight">
          PG HELP
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="opacity-90 transition-opacity hover:opacity-100 hover:underline hover:underline-offset-4">
              {link.label}
            </Link>
          ))}
          <button type="button" onClick={() => showComingSoon('Property listing')} className="opacity-90 hover:underline hover:underline-offset-4 hover:opacity-100">
            List Your Property
          </button>
          <button
            type="button"
            onClick={() => showComingSoon('Login')}
            className={cn(
              'rounded-full px-5 py-2 font-semibold transition-colors',
              overlay ? 'bg-white text-foreground hover:bg-white/90' : 'bg-foreground text-background hover:bg-foreground/90',
            )}
          >
            Login
          </button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="mx-4 rounded-xl border border-border bg-card p-2 text-foreground shadow-xl md:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">
              {link.label}
            </Link>
          ))}
          <button type="button" onClick={() => showComingSoon('Property listing')} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-muted">
            List Your Property
          </button>
          <button type="button" onClick={() => showComingSoon('Login')} className="mt-1 block w-full rounded-lg bg-foreground px-3 py-3 text-left text-sm font-semibold text-background">
            Login
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="coming-soon-title"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto w-[min(92vw,26rem)] rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-foreground/40"
      >
        <div className="p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Prototype</p>
          <h2 id="coming-soon-title" className="mt-1 font-serif text-2xl">
            {comingSoon} is coming soon
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This first version of PG HELP covers browsing by college. Accounts and property submissions arrive in a later phase.
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Got it
          </button>
        </div>
      </dialog>
    </header>
  )
}
