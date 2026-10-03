export type Category = 'food' | 'shelter' | 'hygiene' | 'wifi' | 'social'
export type Source = 'verified' | 'community'

export interface Resource {
  id: string
  name: string
  category: Category
  description: string
  contact: string
  hours: string
  openNow: boolean
  source: Source
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  distanceMeters?: number
}

export interface NearResponse {
  items: Resource[]
}

export function categoryLabel(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; blurb: string }
> = {
  food: { label: 'Food', icon: '🍽️', blurb: 'Meals & food support' },
  shelter: { label: 'Shelter', icon: '🏠', blurb: 'Sleep & emergency beds' },
  hygiene: { label: 'Hygiene', icon: '🚿', blurb: 'Showers & toiletries' },
  wifi: { label: 'Wi-Fi / charging', icon: '📶', blurb: 'Connect & charge devices' },
  social: { label: 'Social support', icon: '🤝', blurb: 'Advice & community help' },
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'food', label: CATEGORY_META.food.label },
  { id: 'shelter', label: CATEGORY_META.shelter.label },
  { id: 'hygiene', label: CATEGORY_META.hygiene.label },
  { id: 'wifi', label: CATEGORY_META.wifi.label },
  { id: 'social', label: CATEGORY_META.social.label },
]

export const DUBLIN_CENTER = { lat: 53.3498, lng: -6.2603 }

export type ReportType = 'closed' | 'wrong_info' | 'gone'

export interface CreateResourceInput {
  name: string
  category: Category
  description: string
  contact: string
  hours: string
  openNow: boolean
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export interface StatsResponse {
  totalResources: number
  verified: number
  community: number
  byCategory: Record<Category, number>
  pendingReports: number
}
