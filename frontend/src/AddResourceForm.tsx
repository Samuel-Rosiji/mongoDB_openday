import { useEffect, useState } from 'react'
import { postResource } from './api'
import { reverseGeocode, searchStreet } from './geocode'
import {
  HOURS_PRESETS,
  type HoursPresetId,
  presetFromHours,
} from './hoursPresets'
import {
  CATEGORIES,
  CATEGORY_META,
  type Category,
  type Resource,
} from './types'

export function AddResourceForm({
  lat,
  lng,
  locationLabel,
  manualPinVersion,
  onLocationChange,
  onLocationLabel,
  onCreated,
  onCancel,
}: {
  lat: number
  lng: number
  locationLabel: string | null
  manualPinVersion: number
  onLocationChange: (lat: number, lng: number) => void
  onLocationLabel: (label: string | null) => void
  onCreated: (resource: Resource) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('food')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')
  const [hours, setHours] = useState('')
  const [hoursPreset, setHoursPreset] = useState<HoursPresetId>('none')
  const [openNow, setOpenNow] = useState(true)
  const [street, setStreet] = useState('')
  const [busy, setBusy] = useState(false)
  const [geocodeBusy, setGeocodeBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const result = await reverseGeocode(lat, lng)
      if (cancelled) return
      if (result) {
        setStreet(result.displayName.split(',')[0]?.trim() || result.displayName)
        onLocationLabel(result.displayName)
      } else {
        onLocationLabel('Pin placed — coordinates saved on publish.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lat, lng, manualPinVersion, onLocationLabel])

  const findOnMap = async () => {
    const s = street.trim()
    if (!s) {
      setMessage('Enter a street or drag the pin on the map.')
      return
    }

    setGeocodeBusy(true)
    setMessage(null)
    try {
      const result = await searchStreet(s)
      if (!result) {
        setMessage('Address not found — drag the pin on the map.')
        return
      }
      onLocationChange(result.lat, result.lng)
      onLocationLabel(result.displayName)
      setMessage('Pin updated — check the map.')
    } catch {
      setMessage('Could not search address — drag the pin on the map.')
    } finally {
      setGeocodeBusy(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const created = await postResource({
        name,
        category,
        description,
        contact,
        hours,
        openNow,
        location: { type: 'Point', coordinates: [lng, lat] },
      })
      setMessage('Resource submitted.')
      onCreated(created)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Submit failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="form add-form" onSubmit={(e) => void submit(e)}>
      <p className="form-intro">
        Share a community resource. It will appear as <strong>Community</strong>{' '}
        until reviewed.
      </p>

      <div className="form-field">
        <label className="field-label" htmlFor="resource-name">Name</label>
        <input
          id="resource-name"
          className="field-input"
          required
          value={name}
          placeholder="e.g. Saturday soup kitchen"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-field">
        <span className="field-label" id="category-label">Category</span>
        <div className="category-pick" role="radiogroup" aria-labelledby="category-label">
          {CATEGORIES.map(({ id }) => {
            const meta = CATEGORY_META[id]
            const active = category === id
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`category-pick-btn cat-${id}${active ? ' active' : ''}`}
                onClick={() => setCategory(id)}
              >
                <span className="category-pick-icon" aria-hidden="true">
                  {meta.icon}
                </span>
                <span className="category-pick-label">{meta.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="resource-desc">Description</label>
        <textarea
          id="resource-desc"
          className="field-input"
          required
          rows={3}
          value={description}
          placeholder="What’s offered and when to go?"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="resource-contact">
          Contact <span className="optional">(optional)</span>
        </label>
        <input
          id="resource-contact"
          className="field-input"
          value={contact}
          placeholder="Phone, email or link"
          onChange={(e) => setContact(e.target.value)}
        />
      </div>

      <fieldset className="fieldset">
        <legend>Opening hours</legend>
        <div className="form-field">
          <span className="field-label" id="hours-preset-label">Schedule</span>
          <div
            className="hours-pick"
            role="radiogroup"
            aria-labelledby="hours-preset-label"
          >
            {HOURS_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={hoursPreset === p.id}
                className={`hours-pick-btn${hoursPreset === p.id ? ' active' : ''}`}
                onClick={() => {
                  setHoursPreset(p.id)
                  if (p.id === 'custom') return
                  setHours(p.value)
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {hoursPreset === 'custom' && (
          <div className="form-field">
            <label className="field-label" htmlFor="resource-hours">Custom hours</label>
            <input
              id="resource-hours"
              className="field-input"
              value={hours}
              placeholder="e.g. Tue & Thu 18:00–20:00"
              onChange={(e) => setHours(e.target.value)}
              onBlur={() => {
                setHoursPreset(presetFromHours(hours))
              }}
            />
          </div>
        )}
        <label className="toggle-card open-now">
          <input
            type="checkbox"
            className="toggle-card-input"
            checked={openNow}
            onChange={(e) => setOpenNow(e.target.checked)}
          />
          <span className="toggle-card-body">
            <strong>Open right now</strong>
            <span className="meta">Shows in “Open now” searches</span>
          </span>
        </label>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Location</legend>
        <p className="field-help">
          <strong>Drag the pin</strong> on the map (best for demo), or search by street.
        </p>
        <div className="form-field">
          <label className="field-label" htmlFor="resource-street">
            Street address <span className="optional">(optional)</span>
          </label>
          <input
            id="resource-street"
            className="field-input"
            value={street}
            placeholder="e.g. 1 Arran Quay, Dublin"
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn secondary"
          disabled={geocodeBusy}
          onClick={() => void findOnMap()}
        >
          {geocodeBusy ? 'Searching…' : 'Find on map'}
        </button>
        {locationLabel && (
          <p className="location-preview">{locationLabel}</p>
        )}
      </fieldset>

      <div className="form-actions">
        <button type="button" className="btn secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn" disabled={busy}>
          {busy ? 'Saving…' : 'Publish (community)'}
        </button>
      </div>
      {message && (
        <p
          className={
            message.includes('submitted') || message.includes('Pin updated')
              ? 'success'
              : 'error'
          }
        >
          {message}
        </p>
      )}
    </form>
  )
}
