import { TileLayer } from 'react-leaflet'
import { getMapboxStyle, getMapboxToken } from './mapbox'

/** Mapbox Streets when token is set; otherwise OSM (no key). */
export function MapTiles() {
  const token = getMapboxToken()
  const style = getMapboxStyle()

  if (token) {
    return (
      <TileLayer
        attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url={`https://api.mapbox.com/styles/v1/${style}/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`}
        tileSize={512}
        zoomOffset={-1}
        maxZoom={20}
      />
    )
  }

  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      maxZoom={19}
    />
  )
}
