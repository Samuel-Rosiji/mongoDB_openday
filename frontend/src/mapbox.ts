export function getMapboxToken(): string | undefined {
  const t = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined)?.trim()
  if (!t || !t.startsWith('pk.')) return undefined
  return t
}

export function hasMapbox(): boolean {
  return Boolean(getMapboxToken())
}

/** Google-like default; override with VITE_MAPBOX_STYLE=mapbox/light-v11 etc. */
export function getMapboxStyle(): string {
  const custom = (import.meta.env.VITE_MAPBOX_STYLE as string | undefined)?.trim()
  if (custom) return custom
  return 'mapbox/streets-v12'
}
