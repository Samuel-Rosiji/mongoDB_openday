export type HoursPresetId =
  | 'none'
  | 'weekdays'
  | 'daily'
  | '24_7'
  | 'weekends'
  | 'custom'

export const HOURS_PRESETS: {
  id: HoursPresetId
  label: string
  value: string
}[] = [
  { id: 'none', label: 'Not listed', value: '' },
  { id: 'weekdays', label: 'Mon–Fri 9–5', value: 'Mon–Fri 9:00–17:00' },
  { id: 'daily', label: 'Daily 9–5', value: 'Daily 9:00–17:00' },
  { id: '24_7', label: '24/7', value: '24 hours' },
  { id: 'weekends', label: 'Weekends', value: 'Sat–Sun 10:00–16:00' },
  { id: 'custom', label: 'Custom', value: '' },
]

export function presetFromHours(hours: string): HoursPresetId {
  const match = HOURS_PRESETS.find((p) => p.id !== 'custom' && p.value === hours)
  if (match) return match.id
  if (!hours.trim()) return 'none'
  return 'custom'
}
