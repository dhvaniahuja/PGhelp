# PG HELP — Backend Architecture & Data Integration Guide

This document describes the backend architecture, data service layer, API specifications, and the future Supabase migration roadmap for **PG HELP**.

---

## 1. Architecture Overview

To accommodate an immediate submission deadline without sacrificing long-term scalability, the project follows a **Modular Service-Oriented Architecture**:

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 (App Router)             │
│   Home (/)  │  College (/colleges/[slug])  │  Saved    │
│            Listing Details (/listings/[id])            │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────▼─────────────┐
             │    lib/services/pg-service │  ◄── Abstraction Service Layer
             └─────────────┬─────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
  lib/data/pg-listings.ts       [Future: Supabase DB]
   (21 Verified Real PGs)      (PostgreSQL + RLS + PostGIS)
```

### Key Architectural Benefits:
1. **Zero UI Rewrite on DB Migration**: All React Server and Client Components consume data exclusively via `lib/services/pg-service.ts`. When moving to Supabase, only the internal service methods need to point to Supabase queries; the UI components and pages remain unchanged.
2. **Strict Data Integrity**: Real listings extracted from `PG_Data_Updated_Editable.xlsx` / `data/PG_Data_Updated_Editable.csv` are used. Missing fields (such as unverified rent or photos) are transparently indicated rather than populated with fake data.
3. **Local State Persistence**: Student bookmarks/favorites and visit inquiries are handled via browser storage (`localStorage`) with synchronous event synchronization.

---

## 2. Real PG Dataset (`lib/data/pg-listings.ts`)

Contains 21 real PG listings across Bangalore's top 8 university campuses:
* **BMS College of Engineering** (Basavanagudi)
* **RV College of Engineering** (Mysuru Road)
* **Ramaiah Institute of Technology** (Mathikere)
* **PES University** (Banashankari / Mysore Road)
* **Bangalore Institute of Technology** (V.V. Puram / Kalasipalya)
* **Dayananda Sagar College of Engineering** (Kumaraswamy Layout)
* **Christ University** (Hosur Road / S.G. Palya)
* **Jain University** (Jayanagar)

### Data Schema (`PgListing` Interface):
```typescript
export interface PgListing {
  id: string                   // Unique slugified ID, e.g. 'bms-paradise-boys-pg'
  name: string                 // Real PG Name from map/business listing
  collegeSlug: string          // Links to college category (e.g. 'bms-college-of-engineering')
  collegeName: string          // Full college name
  collegeShortName: string     // Abbreviation (e.g. 'BMSCE')
  area: string                 // Locality
  address: string              // Full street address
  type: 'pg' | 'hostel' | 'flat'
  gender: 'boys' | 'girls' | 'co-living'
  genderLabel: string          // 'Men', 'Women', 'Co-living'
  googleMapsRating: number | null // Authentic Google Maps star rating
  phone: string | null         // Contact phone number
  googleMapsUrl: string        // Outbound link to verified Google Maps search
  verificationNotes: string    // Notes from field research
  distanceNote: string | null  // Real distance note where recorded
  distanceKm: number | null    // Numerical distance in km (when verified)
  rent: number | null          // Monthly rent (null if unverified)
  deposit: number | null       // Deposit amount (null if unverified)
  amenities: string[]          // Verified amenities
  foodIncluded: boolean | null // Food inclusion policy
  image: string | null         // Photo asset URL
  isVerifiedListing: boolean   // Verification status
  source: string               // Provenance notes
}
```

---

## 3. Data Access Layer (`lib/services/pg-service.ts`)

The service provides clean asynchronous functions:
* `getAllListings()`: Retrieves all 21 listings.
* `getListingsByCollege(collegeSlug, filters, sort)`: Retrieves stays associated with a campus, applying criteria (gender, property type, rent budget, amenities) and sorting (ratings, distance, rent, name).
* `getListingById(id)`: Returns a single PG listing by ID.
* `searchListings(query, filters)`: Searches across PG names, areas, and addresses.
* `getListingsCountByCollege()`: Aggregates counts per college for the homepage campus grid.

---

## 4. API Endpoints (Next.js Route Handlers)

### `GET /api/colleges`
Returns all 8 supported colleges along with live stay counts.
* **Response**:
```json
{
  "success": true,
  "data": [
    {
      "slug": "bms-college-of-engineering",
      "name": "BMS College of Engineering",
      "shortName": "BMSCE",
      "area": "Basavanagudi",
      "listingsCount": 2
    }
  ]
}
```

### `GET /api/properties`
Fetches listings with query parameters.
* **Query Parameters**:
  * `college` (e.g. `christ-university`)
  * `gender` (`boys`, `girls`, `co-living`, `any`)
  * `type` (`pg`, `hostel`, `flat`)
  * `sort` (`rating`, `distance`, `rent-asc`, `rent-desc`, `name-asc`, `relevance`)
  * `q` (free-text search)

### `GET /api/properties/:id`
Fetches a single listing with complete details, contact numbers, and external map links.

---

## 5. Client-Side Features

1. **Shortlist & Favourites (`/saved`)**:
   - Students can bookmark any stay by clicking the heart button on listing cards or detail pages.
   - Synchronized across tabs via `localStorage` (`pg_help_saved_listings_v1`).
   - Live counter in the navigation header displays the number of saved stays.
2. **Direct Contact & Inquiries**:
   - One-tap phone calling (`tel:`) and pre-filled WhatsApp messaging.
   - "Schedule a Visit" form on the PG detail page saves lead inquiries to `localStorage` (`pg_help_inquiries_v1`).
3. **Simulated Authentication & Landlord Submissions**:
   - Student and Landlord login simulator accessible from the header.
   - "List Your Property" form records new landlord submissions into `pg_help_landlord_submissions_v1` with status `pending_verification`.

---

## 6. Future Supabase Migration Roadmap

When transitioning to a full Supabase PostgreSQL backend:
1. Run migrations in `supabase/migrations/` to create the 14 relational tables (`colleges`, `properties`, `rooms`, `profiles`, `reviews`, `inquiries`, etc.).
2. Import `data/PG_Data_Updated_Editable.csv` into the `properties` table.
3. Update `lib/services/pg-service.ts` to call Supabase client methods (`supabase.from('properties').select(...)`).
4. Replace `localStorage` handlers in `useSavedListings` with calls to `/api/saved-listings`.
