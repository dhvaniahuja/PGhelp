export type PropertyType = 'pg' | 'hostel' | 'flat'
export type Gender = 'boys' | 'girls' | 'co-living'
export type Sharing = 'single' | 'double' | 'triple'

export const AMENITIES = [
  'Wi-Fi',
  'AC',
  'Laundry',
  'Housekeeping',
  'Power backup',
  'Attached bathroom',
  'Parking',
] as const
export type Amenity = (typeof AMENITIES)[number]

export type SampleListing = {
  id: string
  label: string
  image: string
  imageAlt: string
  type: PropertyType
  roomType: string
  sharing: Sharing
  gender: Gender
  foodIncluded: boolean
  demoRent: number
  demoRating: number
  demoDistanceKm: number
  amenities: Amenity[]
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  pg: 'PG',
  hostel: 'Hostel',
  flat: 'Flat',
}

export const GENDER_LABELS: Record<Gender, string> = {
  boys: 'Boys',
  girls: 'Girls',
  'co-living': 'Co-living',
}

export const SHARING_LABELS: Record<Sharing, string> = {
  single: 'Single',
  double: 'Double',
  triple: 'Triple',
}

const BASE_LISTINGS: Omit<SampleListing, 'demoDistanceKm'>[] = [
  {
    id: 'sample-1',
    label: 'Sample Listing 1',
    image: '/images/listings/listing-1.png',
    imageAlt: 'Twin-sharing PG room with two beds, a study table and a steel almirah',
    type: 'pg',
    roomType: 'Double sharing room',
    sharing: 'double',
    gender: 'girls',
    foodIncluded: true,
    demoRent: 9500,
    demoRating: 4.3,
    amenities: ['Wi-Fi', 'Laundry', 'Housekeeping', 'Power backup'],
  },
  {
    id: 'sample-2',
    label: 'Sample Listing 2',
    image: '/images/listings/listing-2.png',
    imageAlt: 'Hostel room with three single beds and wooden study desks',
    type: 'hostel',
    roomType: 'Triple sharing room',
    sharing: 'triple',
    gender: 'boys',
    foodIncluded: true,
    demoRent: 7000,
    demoRating: 4.0,
    amenities: ['Wi-Fi', 'Laundry', 'Power backup'],
  },
  {
    id: 'sample-3',
    label: 'Sample Listing 3',
    image: '/images/listings/listing-3.png',
    imageAlt: 'Living room of a 1BHK flat with a sofa and a balcony with plants',
    type: 'flat',
    roomType: '1BHK, entire flat',
    sharing: 'single',
    gender: 'co-living',
    foodIncluded: false,
    demoRent: 16500,
    demoRating: 4.1,
    amenities: ['Wi-Fi', 'Parking', 'Power backup', 'Attached bathroom'],
  },
  {
    id: 'sample-4',
    label: 'Sample Listing 4',
    image: '/images/listings/listing-4.png',
    imageAlt: 'Single occupancy PG room with a bed, wardrobe and study lamp',
    type: 'pg',
    roomType: 'Single occupancy room',
    sharing: 'single',
    gender: 'boys',
    foodIncluded: true,
    demoRent: 13500,
    demoRating: 4.6,
    amenities: ['Wi-Fi', 'AC', 'Attached bathroom', 'Housekeeping'],
  },
  {
    id: 'sample-5',
    label: 'Sample Listing 5',
    image: '/images/listings/listing-5.png',
    imageAlt: 'PG dining table set with rice, sambar and vegetable curry on steel plates',
    type: 'pg',
    roomType: 'Triple sharing room',
    sharing: 'triple',
    gender: 'girls',
    foodIncluded: true,
    demoRent: 8000,
    demoRating: 4.4,
    amenities: ['Wi-Fi', 'Laundry', 'Housekeeping'],
  },
  {
    id: 'sample-6',
    label: 'Sample Listing 6',
    image: '/images/listings/listing-6.png',
    imageAlt: 'Three-storey residential building with balconies and two-wheelers parked outside',
    type: 'flat',
    roomType: '2BHK, double sharing',
    sharing: 'double',
    gender: 'co-living',
    foodIncluded: false,
    demoRent: 11000,
    demoRating: 3.9,
    amenities: ['Wi-Fi', 'Parking', 'Laundry', 'Power backup'],
  },
]

const DEMO_DISTANCES_KM = [0.6, 0.9, 1.3, 1.8, 2.4, 3.1]

/** Rotates placeholder distances per college so each results page has its own context. */
export function getSampleListings(collegeIndex: number): SampleListing[] {
  return BASE_LISTINGS.map((listing, i) => ({
    ...listing,
    demoDistanceKm: DEMO_DISTANCES_KM[(i + collegeIndex * 2) % DEMO_DISTANCES_KM.length],
  }))
}

export const BUDGET_OPTIONS = [
  { value: 'any', label: 'Any budget' },
  { value: '8000', label: 'Up to ₹8,000' },
  { value: '12000', label: 'Up to ₹12,000' },
  { value: '18000', label: 'Up to ₹18,000' },
  { value: '25000', label: 'Up to ₹25,000' },
] as const

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'pg', label: 'PG' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'flat', label: 'Flat' },
] as const

export const RENT_MIN = 5000
export const RENT_MAX = 25000

export function formatRupees(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}
