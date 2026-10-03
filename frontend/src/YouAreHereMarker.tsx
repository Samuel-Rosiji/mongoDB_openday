import { Marker } from 'react-leaflet'
import { hereIcon } from './mapIcons'

export function YouAreHereMarker({
  lat,
  lng,
}: {
  lat: number
  lng: number
  label: string
  kioskName?: string
}) {
  return (
    <Marker position={[lat, lng]} icon={hereIcon} zIndexOffset={1000} />
  )
}
