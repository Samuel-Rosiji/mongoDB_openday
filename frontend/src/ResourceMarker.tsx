import type { Marker as LeafletMarker } from 'leaflet'
import { useEffect, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { resourceIcon } from './mapIcons'
import { CATEGORY_META, type Resource } from './types'

function formatDistance(m?: number) {
  if (m == null) return null
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
}

export function ResourceMarker({
  resource,
  selected,
  onSelect,
}: {
  resource: Resource
  selected: boolean
  onSelect: () => void
}) {
  const [lng, lat] = resource.location.coordinates
  const dist = formatDistance(resource.distanceMeters)
  const markerRef = useRef<LeafletMarker>(null)
  const meta = CATEGORY_META[resource.category]

  useEffect(() => {
    if (selected) markerRef.current?.openPopup()
    else markerRef.current?.closePopup()
  }, [selected])

  return (
    <Marker
      ref={markerRef}
      position={[lat, lng]}
      icon={resourceIcon(resource.category, resource.source, selected)}
      zIndexOffset={selected ? 2000 : 500}
      eventHandlers={{ click: () => onSelect() }}
    >
      <Popup
        className="caremap-popup"
        offset={[0, -72]}
        closeButton
        autoPan
        autoPanPadding={[100, 100]}
      >
        <div className={`popup-card cat-${resource.category}`}>
          <div className="popup-hero">
            <span className="popup-icon" aria-hidden="true">{meta.icon}</span>
            <div>
              <span className="popup-category">{meta.label}</span>
              <span className="popup-blurb">{meta.blurb}</span>
            </div>
          </div>
          <div className="popup-body">
            <p className="popup-title">{resource.name}</p>
            <div className="popup-badges">
            <span
              className={`badge ${resource.source === 'verified' ? 'verified' : 'community'}`}
            >
              {resource.source === 'verified' ? '✓ Verified' : 'Community'}
            </span>
            <span
              className={`popup-status ${resource.openNow ? 'open' : 'closed'}`}
            >
              {resource.openNow ? '● Open now' : '○ Closed'}
            </span>
            {dist && <span className="popup-distance">{dist}</span>}
            </div>
            {resource.hours && (
              <p className="popup-hours">
                <span className="popup-hours-label">Hours</span>
                {resource.hours}
              </p>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
