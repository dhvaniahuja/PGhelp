'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'pg_help_saved_listings_v1'
const EVENT_NAME = 'pg_help_saved_listings_updated'

export function getSavedListingIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function isListingSaved(id: string): boolean {
  const ids = getSavedListingIds()
  return ids.includes(id)
}

export function toggleSavedListing(id: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const ids = getSavedListingIds()
    let updated: string[]
    let isNowSaved = false

    if (ids.includes(id)) {
      updated = ids.filter((item) => item !== id)
      isNowSaved = false
    } else {
      updated = [...ids, id]
      isNowSaved = true
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { ids: updated } }))
    return isNowSaved
  } catch {
    return false
  }
}

export function useSavedListings() {
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setSavedIds(getSavedListingIds())
    setIsLoaded(true)

    function handleUpdate(e: Event) {
      const customEvent = e as CustomEvent<{ ids: string[] }>
      if (customEvent.detail?.ids) {
        setSavedIds(customEvent.detail.ids)
      } else {
        setSavedIds(getSavedListingIds())
      }
    }

    window.addEventListener(EVENT_NAME, handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return {
    savedIds,
    isLoaded,
    isSaved: (id: string) => savedIds.includes(id),
    toggleSave: (id: string) => toggleSavedListing(id),
  }
}
