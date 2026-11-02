'use client'

import { Check, Heart, MessageSquare, Phone, Send, Share2 } from 'lucide-react'
import { useState } from 'react'
import type { PgListing } from '@/lib/data/pg-listings'
import { useSavedListings } from '@/lib/saved-listings'
import { cn } from '@/lib/utils'

export function ListingDetailActions({ listing }: { listing: PgListing }) {
  const { isSaved, toggleSave } = useSavedListings()
  const saved = isSaved(listing.id)
  const [copied, setCopied] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquirySent, setInquirySent] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [inquiryMessage, setInquiryMessage] = useState('')

  const cleanPhone = listing.phone ? listing.phone.replace(/[^0-9]/g, '') : ''
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Hi, I found ${listing.name} on PG Help and would like to check room availability and rent near ${listing.collegeShortName}.`,
      )}`
    : null

  function handleShare() {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!studentName || !studentPhone) return

    // Save inquiry to localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('pg_help_inquiries_v1') || '[]')
      existing.unshift({
        id: `inq-${Date.now()}`,
        listingId: listing.id,
        listingName: listing.name,
        studentName,
        studentPhone,
        visitDate,
        inquiryMessage,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('pg_help_inquiries_v1', JSON.stringify(existing))
    } catch {
      // ignore localstorage error
    }

    setInquirySent(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {listing.phone ? (
          <a
            href={`tel:${listing.phone}`}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
          >
            <Phone className="size-4" aria-hidden="true" />
            Call {listing.phone}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setInquiryOpen(true)}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
          >
            <MessageSquare className="size-4" aria-hidden="true" />
            Send Inquiry to PG
          </button>
        )}

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-50 px-5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <MessageSquare className="size-4" aria-hidden="true" />
            WhatsApp
          </a>
        )}

        <button
          type="button"
          onClick={() => toggleSave(listing.id)}
          aria-label={saved ? 'Remove from saved' : 'Save to favourites'}
          className={cn(
            'inline-flex size-12 items-center justify-center rounded-xl border transition-colors',
            saved
              ? 'border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
              : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Heart className={cn('size-5', saved && 'fill-current')} />
        </button>

        <button
          type="button"
          onClick={handleShare}
          title="Share link"
          className="inline-flex size-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="size-5 text-emerald-600" /> : <Share2 className="size-5" />}
        </button>
      </div>

      {copied && (
        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
          ✓ Listing link copied to clipboard!
        </p>
      )}

      {/* Schedule a Visit or Inquiry Card */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-serif text-lg font-medium">Interested in visiting this PG?</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Leave your details to schedule an in-person room visit or request rent confirmation.
        </p>

        {inquirySent ? (
          <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            <p className="text-sm font-semibold">Visit request recorded!</p>
            <p className="mt-1 text-xs">
              Your inquiry has been stored locally. For fastest response, call the PG directly at{' '}
              <strong className="underline">{listing.phone || 'the contact number'}</strong>.
            </p>
            <button
              type="button"
              onClick={() => setInquirySent(false)}
              className="mt-3 text-xs font-semibold text-emerald-800 underline dark:text-emerald-300"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="student-name" className="block text-xs font-medium uppercase text-muted-foreground">
                Your Name
              </label>
              <input
                id="student-name"
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="student-phone" className="block text-xs font-medium uppercase text-muted-foreground">
                Mobile Number
              </label>
              <input
                id="student-phone"
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="visit-date" className="block text-xs font-medium uppercase text-muted-foreground">
                  Preferred Visit Date
                </label>
                <input
                  id="visit-date"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="room-pref" className="block text-xs font-medium uppercase text-muted-foreground">
                  Room Preference
                </label>
                <select
                  id="room-pref"
                  className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-2 text-sm outline-none focus:border-primary"
                >
                  <option value="any">Any Room</option>
                  <option value="single">Single Sharing</option>
                  <option value="double">Double Sharing</option>
                  <option value="triple">Triple Sharing</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="inquiry-msg" className="block text-xs font-medium uppercase text-muted-foreground">
                Message or Question (Optional)
              </label>
              <textarea
                id="inquiry-msg"
                rows={2}
                placeholder="e.g. Inquiring for 1st year admission at BMSCE. Is food included?"
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              <Send className="size-3.5" aria-hidden="true" />
              Request Visit / Check Availability
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
