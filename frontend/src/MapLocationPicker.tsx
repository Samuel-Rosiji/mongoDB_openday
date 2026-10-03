import type { Marker as LeafletMarker } from 'leaflet'
import { useEffect, useRef } from 'react'
import { Marker, useMap, useMapEvents } from 'react-leaflet'
import { placeIcon } from './mapIcons'

export function MapLocationPicker({
  lat,
  lng,
  onPick,
}: {
  lat: number
  lng: number
  onPick: (lat: number, lng: number) => void
}) {
  const markerRef = useRef<LeafletMarker>(null)

  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })

  return (
    <Marker
      draggable
      position={[lat, lng]}
      icon={placeIcon}
      zIndexOffset={2000}
      ref={markerRef}
      eventHandlers={{
        dragend() {
          const m = markerRef.current
          if (!m) return
          const ll = m.getLatLng()
          onPick(ll.lat, ll.lng)
        },
      }}
    />
  )
}

export function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 16), { duration: 0.4 })
  }, [lat, lng, map])
  return null
}
