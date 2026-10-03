import { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, useMap } from 'react-leaflet'
import { MapTiles } from './MapTiles'
import { AddResourceForm } from './AddResourceForm'
import { Dashboard } from './Dashboard'
import { fetchNear, hasApi } from './api'
import { isDemoMode } from './demo'
import { FlyTo, MapLocationPicker } from './MapLocationPicker'
import { getKioskConfig } from './kiosk'
import { ResourceDetail } from './ResourceDetail'
import { ResourceListItem } from './ResourceListItem'
import { MapLegend } from './MapLegend'
import { MapResize } from './MapResize'
import { ResourceMarker } from './ResourceMarker'
import { YouAreHereMarker } from './YouAreHereMarker'
import {
  CATEGORIES,
  DUBLIN_CENTER,
  type Category,
  type Resource,
} from './types'
import './App.css'

type View = 'map' | 'add' | 'dashboard'

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

const kiosk = getKioskConfig()

function App() {
  const [view, setView] = useState<View>('map')
  const [position, setPosition] = useState(() =>
    kiosk.enabled
      ? { lat: kiosk.lat, lng: kiosk.lng }
      : DUBLIN_CENTER,
  )
  const [pickLocation, setPickLocation] = useState(DUBLIN_CENTER)
  const [pickLocationLabel, setPickLocationLabel] = useState<string | null>(null)
  const [manualPinVersion, setManualPinVersion] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    'food',
    'hygiene',
  ])
  const [openNow, setOpenNow] = useState(true)
  const [items, setItems] = useState<Resource[]>([])
  const [selected, setSelected] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (kiosk.enabled) {
      const p = { lat: kiosk.lat, lng: kiosk.lng }
      setPosition(p)
      setPickLocation(p)
      return
    }
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPosition(p)
        setPickLocation(p)
      },
      () => {
        setPosition(DUBLIN_CENTER)
        setPickLocation(DUBLIN_CENTER)
      },
      { timeout: 8000 },
    )
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchNear(
        position.lat,
        position.lng,
        selectedCategories,
        openNow,
      )
      setItems(data.items)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [position, selectedCategories, openNow])

  useEffect(() => {
    if (view === 'map') void load()
  }, [load, view])

  useEffect(() => {
    if (selected && !items.some((i) => i.id === selected.id)) {
      setSelected(null)
    }
  }, [items, selected])

  const toggleCategory = (id: Category) => {
    setSelected(null)
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  const selectedVisible =
    selected && items.some((i) => i.id === selected.id) ? selected : null

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>CareMap Dublin</h1>
          <p className="tagline">
            {kiosk.enabled
              ? `Public screen · resources near ${kiosk.label}`
              : 'Resources near you — verified & community'}
          </p>
        </div>
        {kiosk.enabled && (
          <p className="kiosk-badge" title="Fixed location for this display">
            You are here: {kiosk.label}
          </p>
        )}
        <nav className="nav-tabs" aria-label="Main">
          <button
            type="button"
            className={view === 'map' ? 'nav active' : 'nav'}
            onClick={() => setView('map')}
          >
            Map
          </button>
          <button
            type="button"
            className={view === 'add' ? 'nav active' : 'nav'}
            onClick={() => {
              setPickLocation(position)
              setPickLocationLabel(null)
              setManualPinVersion(0)
              setView('add')
            }}
          >
            Add resource
          </button>
          <button
            type="button"
            className={view === 'dashboard' ? 'nav active' : 'nav'}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
        </nav>
      </header>

      {view === 'dashboard' ? (
        <main className="dashboard-main">
          <Dashboard />
        </main>
      ) : (
        <>
          <aside className="sidebar" ref={sidebarRef}>
            {view === 'add' ? (
              <section className="panel panel-add">
                <h2>Add community resource</h2>
                <p className="panel-subtitle">Help others find support near you</p>
                <AddResourceForm
                  lat={pickLocation.lat}
                  lng={pickLocation.lng}
                  locationLabel={pickLocationLabel}
                  manualPinVersion={manualPinVersion}
                  onLocationChange={(lat, lng) => {
                    setPickLocation({ lat, lng })
                  }}
                  onLocationLabel={setPickLocationLabel}
                  onCreated={(created) => {
                    setItems((prev) => [
                      { ...created, distanceMeters: 0 },
                      ...prev,
                    ])
                    setSelected(created)
                    setView('map')
                  }}
                  onCancel={() => setView('map')}
                />
              </section>
            ) : (
              <>
                <section className="panel">
                  <h2>Filters</h2>
                  <div className="chips">
                    {CATEGORIES.map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        className={`chip ${selectedCategories.includes(id) ? 'active' : ''}`}
                        onClick={() => toggleCategory(id)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <label className="toggle-card filter-open-now">
                    <input
                      type="checkbox"
                      className="toggle-card-input"
                      checked={openNow}
                      onChange={(e) => {
                        setSelected(null)
                        setOpenNow(e.target.checked)
                      }}
                    />
                    <span className="toggle-card-body">
                      <strong>Open now only</strong>
                      <span className="meta">Hide closed places</span>
                    </span>
                  </label>
                  <button
                    type="button"
                    className={`btn${loading ? ' is-loading' : ''}`}
                    disabled={loading}
                    onClick={() => void load()}
                  >
                    {loading ? 'Updating…' : 'Refresh'}
                  </button>
                  <MapLegend />
                  {!hasApi() && !isDemoMode() && (
                    <p className="hint">
                      Dev: mock data — set VITE_API_URL when API is ready.
                    </p>
                  )}
                </section>

                <section className="panel list">
                  <h2>
                    Nearby {loading ? '(loading…)' : `(${items.length})`}
                  </h2>
                  {error && <p className="error">{error}</p>}
                  {!loading && !error && items.length === 0 && (
                    <div className="empty-state">
                      <p>
                        <strong>No resources match</strong> these filters nearby.
                      </p>
                      <p className="meta">
                        Try more categories, turn off “Open now”, or move the map
                        after the API is connected.
                      </p>
                    </div>
                  )}
                  <ul className={loading ? 'list-loading' : undefined}>
                    {loading && items.length > 0 && (
                      <li className="list-loading-banner" aria-live="polite">
                        Updating results…
                      </li>
                    )}
                    {items.map((r) => (
                      <ResourceListItem
                        key={r.id}
                        resource={r}
                        selected={selected?.id === r.id}
                        onSelect={() => setSelected(r)}
                      />
                    ))}
                  </ul>
                </section>

                {selectedVisible && (
                  <ResourceDetail
                    resource={selectedVisible}
                    scrollRoot={sidebarRef}
                  />
                )}
              </>
            )}
          </aside>

          <main className="map-wrap">
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={15}
              className="map"
            >
              <MapTiles />
              <MapResize watch={`${view}-${selected?.id ?? 'none'}`} />
              {view === 'map' && (
                <>
                  <Recenter lat={position.lat} lng={position.lng} />
                  <YouAreHereMarker
                    lat={position.lat}
                    lng={position.lng}
                    label=""
                    kioskName={undefined}
                  />
                </>
              )}
              {view === 'add' && (
                <>
                  <Recenter lat={pickLocation.lat} lng={pickLocation.lng} />
                  <MapLocationPicker
                    lat={pickLocation.lat}
                    lng={pickLocation.lng}
                    onPick={(lat, lng) => {
                      setPickLocation({ lat, lng })
                      setManualPinVersion((v) => v + 1)
                    }}
                  />
                  <FlyTo lat={pickLocation.lat} lng={pickLocation.lng} />
                </>
              )}
              {view === 'map' &&
                items.map((r) => (
                  <ResourceMarker
                    key={r.id}
                    resource={r}
                    selected={selected?.id === r.id}
                    onSelect={() => setSelected(r)}
                  />
                ))}
            </MapContainer>
          </main>
        </>
      )}
    </div>
  )
}

export default App
