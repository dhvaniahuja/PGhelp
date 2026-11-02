'use client'

import { Heart, LogOut, Menu, Send, User, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useSavedListings } from '@/lib/saved-listings'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/?type=pg#search', label: 'Explore PGs' },
  { href: '/?type=flat#search', label: 'Explore Flats' },
  { href: '/#colleges', label: 'Colleges' },
]

export function SiteHeader({ variant = 'solid' }: { variant?: 'overlay' | 'solid' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<'login' | 'list-property' | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const overlay = variant === 'overlay'
  const { savedIds, isLoaded } = useSavedListings()

  // Simulated User Session state
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'student' | 'landlord' } | null>(null)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginName, setLoginName] = useState('')
  const [loginRole, setLoginRole] = useState<'student' | 'landlord'>('student')

  // Landlord submission state
  const [pgTitle, setPgTitle] = useState('')
  const [pgCollege, setPgCollege] = useState('BMS College of Engineering')
  const [pgPhone, setPgPhone] = useState('')
  const [pgAddress, setPgAddress] = useState('')
  const [submittedProperty, setSubmittedProperty] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pg_help_user_session_v1')
      if (stored) setCurrentUser(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  function openModal(modal: 'login' | 'list-property') {
    setActiveModal(modal)
    setMenuOpen(false)
    dialogRef.current?.showModal()
  }

  function closeModal() {
    dialogRef.current?.close()
    setActiveModal(null)
    setSubmittedProperty(false)
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!loginName) return
    const user = { name: loginName, role: loginRole }
    setCurrentUser(user)
    try {
      localStorage.setItem('pg_help_user_session_v1', JSON.stringify(user))
    } catch {
      // ignore
    }
    closeModal()
  }

  function handleLogout() {
    setCurrentUser(null)
    try {
      localStorage.removeItem('pg_help_user_session_v1')
    } catch {
      // ignore
    }
  }

  function handleListPropertySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pgTitle || !pgPhone) return

    try {
      const existing = JSON.parse(localStorage.getItem('pg_help_landlord_submissions_v1') || '[]')
      existing.unshift({
        id: `prop-${Date.now()}`,
        title: pgTitle,
        college: pgCollege,
        phone: pgPhone,
        address: pgAddress,
        status: 'pending_verification',
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('pg_help_landlord_submissions_v1', JSON.stringify(existing))
    } catch {
      // ignore
    }

    setSubmittedProperty(true)
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
            <Link
              key={link.label}
              href={link.href}
              className="opacity-90 transition-opacity hover:opacity-100 hover:underline hover:underline-offset-4"
            >
              {link.label}
            </Link>
          ))}

          {/* Saved Stays Link with Live Counter */}
          <Link
            href="/saved"
            className="flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100 hover:underline hover:underline-offset-4"
          >
            <Heart className={cn('size-4', savedIds.length > 0 && 'fill-rose-500 text-rose-500')} />
            <span>Saved</span>
            {isLoaded && savedIds.length > 0 && (
              <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[11px] font-bold text-white">
                {savedIds.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => openModal('list-property')}
            className="opacity-90 hover:underline hover:underline-offset-4 hover:opacity-100"
          >
            List Your Property
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold',
                  overlay ? 'bg-white/20 text-white' : 'bg-muted text-foreground',
                )}
              >
                <User className="size-3.5" />
                {currentUser.name} ({currentUser.role})
              </span>
              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                className="opacity-75 hover:opacity-100"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openModal('login')}
              className={cn(
                'rounded-full px-5 py-2 font-semibold transition-colors',
                overlay
                  ? 'bg-white text-foreground hover:bg-white/90'
                  : 'bg-foreground text-background hover:bg-foreground/90',
              )}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile menu button */}
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

      {/* Mobile Drawer */}
      {menuOpen && (
        <div id="mobile-menu" className="mx-4 rounded-xl border border-border bg-card p-3 text-foreground shadow-xl md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/saved"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <Heart className={cn('size-4', savedIds.length > 0 && 'fill-rose-500 text-rose-500')} />
              Saved Stays
            </span>
            {savedIds.length > 0 && (
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                {savedIds.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => openModal('list-property')}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
          >
            List Your Property
          </button>
          {currentUser ? (
            <div className="mt-2 flex items-center justify-between rounded-lg bg-muted p-3">
              <span className="text-sm font-semibold">
                {currentUser.name} ({currentUser.role})
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-destructive hover:underline"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openModal('login')}
              className="mt-2 block w-full rounded-lg bg-foreground px-3 py-2.5 text-left text-sm font-semibold text-background"
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Interactive Modal Dialog */}
      <dialog
        ref={dialogRef}
        aria-labelledby="modal-title"
        onClick={(e) => e.target === dialogRef.current && closeModal()}
        className="m-auto w-[min(92vw,28rem)] rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-foreground/40"
      >
        <div className="p-6">
          {activeModal === 'login' ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">Student & Landlord Portal</p>
              <h2 id="modal-title" className="mt-1 font-serif text-2xl font-medium">
                Log into PG HELP
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Sign in to save properties, track your inquiries, or manage listings.
              </p>

              <form onSubmit={handleLoginSubmit} className="mt-5 space-y-3">
                <div>
                  <label className="block text-xs font-medium uppercase text-muted-foreground">Account Type</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLoginRole('student')}
                      className={cn(
                        'rounded-lg border py-2 text-xs font-semibold transition-colors',
                        loginRole === 'student'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-muted',
                      )}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('landlord')}
                      className={cn(
                        'rounded-lg border py-2 text-xs font-semibold transition-colors',
                        loginRole === 'landlord'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-muted',
                      )}
                    >
                      Landlord / Owner
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="login-name" className="block text-xs font-medium uppercase text-muted-foreground">
                    Your Name
                  </label>
                  <input
                    id="login-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="login-email" className="block text-xs font-medium uppercase text-muted-foreground">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="h-10 flex-1 rounded-lg border border-border text-xs font-medium hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 flex-1 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">Landlord Onboarding</p>
              <h2 id="modal-title" className="mt-1 font-serif text-2xl font-medium">
                List Your Property
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Connect your Bangalore PG or hostel with thousands of verified university students.
              </p>

              {submittedProperty ? (
                <div className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <p className="text-sm font-semibold">Listing Submitted Successfully!</p>
                  <p className="mt-1 text-xs">
                    Your property &quot;{pgTitle}&quot; has been recorded with status <em>pending_verification</em>. Our
                    campus team will contact you at {pgPhone} to confirm room rates and verify details.
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleListPropertySubmit} className="mt-4 space-y-3">
                  <div>
                    <label htmlFor="pg-title" className="block text-xs font-medium uppercase text-muted-foreground">
                      PG / Hostel Name
                    </label>
                    <input
                      id="pg-title"
                      type="text"
                      required
                      placeholder="e.g. Sri Balaji Luxury PG for Gents"
                      value={pgTitle}
                      onChange={(e) => setPgTitle(e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="pg-college" className="block text-xs font-medium uppercase text-muted-foreground">
                      Nearest College Campus
                    </label>
                    <select
                      id="pg-college"
                      value={pgCollege}
                      onChange={(e) => setPgCollege(e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2 text-sm outline-none focus:border-primary"
                    >
                      <option value="BMS College of Engineering">BMS College of Engineering (BMSCE)</option>
                      <option value="RV College of Engineering">RV College of Engineering (RVCE)</option>
                      <option value="Ramaiah Institute of Technology">Ramaiah Institute of Technology (RIT)</option>
                      <option value="PES University">PES University (PESU)</option>
                      <option value="Bangalore Institute of Technology">Bangalore Institute of Technology (BIT)</option>
                      <option value="Dayananda Sagar College of Engineering">
                        Dayananda Sagar College of Engineering (DSCE)
                      </option>
                      <option value="Christ University">Christ University</option>
                      <option value="Jain University">Jain University</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pg-phone" className="block text-xs font-medium uppercase text-muted-foreground">
                      Manager / Owner Mobile
                    </label>
                    <input
                      id="pg-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={pgPhone}
                      onChange={(e) => setPgPhone(e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="pg-address" className="block text-xs font-medium uppercase text-muted-foreground">
                      Address / Locality
                    </label>
                    <input
                      id="pg-address"
                      type="text"
                      required
                      placeholder="e.g. 5th Cross, Hanumanthnagar, Bangalore"
                      value={pgAddress}
                      onChange={(e) => setPgAddress(e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="h-9 flex-1 rounded-lg border border-border text-xs font-medium hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="size-3.5" />
                      Submit Listing
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </dialog>
    </header>
  )
}
