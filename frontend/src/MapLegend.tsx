import { CATEGORIES } from './types'

export function MapLegend() {
  return (
    <div className="map-key" aria-label="Map key">
      <p className="map-key-title">Map key</p>
      <ul className="map-key-list">
        <li>
          <i className="legend-dot here" /> You
        </li>
        {CATEGORIES.map(({ id, label }) => (
          <li key={id}>
            <i className={`legend-dot cat-${id}`} /> {label}
          </li>
        ))}
      </ul>
      <p className="map-key-note">Dashed outline = community resource</p>
    </div>
  )
}
