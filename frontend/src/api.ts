import type {
  Category,
  CreateResourceInput,
  NearResponse,
  ReportType,
  Resource,
  StatsResponse,
} from './types'

const base = (import.meta.env.VITE_API_URL as string | undefined)?.trim()

export function hasApi(): boolean {
  return Boolean(base)
}

async function fetchMockNear(
  categories: Category[],
  openNow: boolean,
): Promise<NearResponse> {
  const res = await fetch('/mock-near.json')
  const data = (await res.json()) as NearResponse
  let items = data.items
  if (categories.length) {
    items = items.filter((r) => categories.includes(r.category))
  }
  if (openNow) {
    items = items.filter((r) => r.openNow)
  }
  return { items }
}

export async function fetchNear(
  lat: number,
  lng: number,
  categories: Category[],
  openNow: boolean,
): Promise<NearResponse> {
  if (base) {
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        openNow: String(openNow),
      })
      if (categories.length) {
        params.set('categories', categories.join(','))
      }
      const res = await fetch(`${base}/api/resources/near?${params}`)
      if (!res.ok) {
        throw new Error(`API error ${res.status}`)
      }
      return res.json() as Promise<NearResponse>
    } catch {
      console.warn('Backend unreachable — using mock data')
      return fetchMockNear(categories, openNow)
    }
  }

  return fetchMockNear(categories, openNow)
}

export async function postResource(
  input: CreateResourceInput,
): Promise<Resource> {
  if (base) {
    try {
      const res = await fetch(`${base}/api/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `API error ${res.status}`)
      }
      return res.json() as Promise<Resource>
    } catch {
      /* mock fallback */
    }
  }

  return {
    id: `mock-${Date.now()}`,
    ...input,
    source: 'community',
    contact: input.contact,
  }
}

export async function postReport(
  resourceId: string,
  type: ReportType,
): Promise<void> {
  if (base) {
    try {
      const res = await fetch(`${base}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId, type }),
      })
      if (!res.ok) {
        throw new Error(`API error ${res.status}`)
      }
      return
    } catch {
      /* mock ok */
    }
  }

  await new Promise((r) => setTimeout(r, 300))
  console.info('[mock] report', { resourceId, type })
}

export async function fetchStats(): Promise<StatsResponse> {
  if (base) {
    try {
      const res = await fetch(`${base}/api/stats`)
      if (!res.ok) {
        throw new Error(`API error ${res.status}`)
      }
      return res.json() as Promise<StatsResponse>
    } catch {
      /* mock fallback */
    }
  }

  const res = await fetch('/mock-stats.json')
  return res.json() as Promise<StatsResponse>
}
