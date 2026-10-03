import L from 'leaflet'
import type { Category, Source } from './types'

export function resourceIcon(
  category: Category,
  source: Source,
  selected = false,
) {
  const sel = selected ? ' pin-selected' : ''
  return L.divIcon({
    className: 'resource-pin-icon',
    html: `<span class="resource-pin cat-${category} src-${source}${sel}" aria-hidden="true"></span>`,
    iconSize: selected ? [48, 56] : [40, 48],
    iconAnchor: selected ? [24, 54] : [20, 46],
  })
}

export const hereIcon = L.divIcon({
  className: 'here-pin-icon',
  html: '<span class="here-pin-dot" aria-hidden="true"></span>',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
})

export const placeIcon = L.divIcon({
  className: 'place-pin-icon',
  html: '<span class="place-pin-dot" aria-hidden="true"></span>',
  iconSize: [44, 48],
  iconAnchor: [22, 46],
})
