import { DUBLIN_CENTER } from './types'

/** Public screen at a fixed place (train station, bus shelter, etc.) */
export interface KioskConfig {
  enabled: boolean
  lat: number
  lng: number
  label: string
}

function parseNum(raw: string | undefined): number | null {
  if (raw == null || raw === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export function getKioskConfig(): KioskConfig {
  const enabled = import.meta.env.VITE_KIOSK_MODE === 'true'
  const lat = parseNum(import.meta.env.VITE_KIOSK_LAT)
  const lng = parseNum(import.meta.env.VITE_KIOSK_LNG)
  const label =
    (import.meta.env.VITE_KIOSK_LABEL as string)?.trim() ||
    'This location'

  if (!enabled || lat == null || lng == null) {
    return {
      enabled: false,
      lat: DUBLIN_CENTER.lat,
      lng: DUBLIN_CENTER.lng,
      label,
    }
  }

  return { enabled: true, lat, lng, label }
}
