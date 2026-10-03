import { getMapboxToken } from './mapbox'

export interface GeocodeResult {
  lat: number
  lng: number
  displayName: string
}

type NominatimHit = { lat: string; lon: string; display_name: string }

async function mapboxSearch(query: string): Promise<GeocodeResult | null> {
  const token = getMapboxToken()
  if (!token) return null

  const path = encodeURIComponent(query)
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${path}.json`,
  )
  url.searchParams.set('country', 'ie')
  url.searchParams.set('limit', '1')
  url.searchParams.set('access_token', token)

  const res = await fetch(url.toString())
  if (!res.ok) return null

  const data = (await res.json()) as {
    features?: { center: [number, number]; place_name: string }[]
  }
  const f = data.features?.[0]
  if (!f) return null

  return {
    lng: f.center[0],
    lat: f.center[1],
    displayName: f.place_name,
  }
}

async function nominatimSearch(q: string): Promise<GeocodeResult | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'ie')
  url.searchParams.set('q', q)

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error('Address lookup failed')
  const data = (await res.json()) as NominatimHit[]
  if (!data.length) return null
  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    displayName: data[0].display_name,
  }
}

/** Street search in Dublin area — or drag the pin (recommended for demo). */
export async function searchStreet(street: string): Promise<GeocodeResult | null> {
  const s = street.trim()
  if (!s) return null

  const queries = [`${s}, Dublin, Ireland`, `${s}, Ireland`]
  for (const q of queries) {
    const mb = await mapboxSearch(q)
    if (mb) return mb
    const nm = await nominatimSearch(q)
    if (nm) return nm
  }
  return null
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<GeocodeResult | null> {
  const token = getMapboxToken()
  if (token) {
    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
    )
    url.searchParams.set('types', 'address,poi,place')
    url.searchParams.set('limit', '1')
    url.searchParams.set('access_token', token)

    const res = await fetch(url.toString())
    if (res.ok) {
      const data = (await res.json()) as {
        features?: { place_name: string }[]
      }
      const name = data.features?.[0]?.place_name
      if (name) {
        return { lat, lng, displayName: name }
      }
    }
  }

  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('format', 'json')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return null

  const data = (await res.json()) as { display_name?: string }
  if (!data.display_name) return null

  return { lat, lng, displayName: data.display_name }
}
