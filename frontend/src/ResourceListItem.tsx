import { CATEGORY_META, type Resource } from './types'

function formatDistance(m?: number) {
  if (m == null) return '—'
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
}

export function ResourceListItem({
  resource,
  selected,
  onSelect,
}: {
  resource: Resource
  selected: boolean
  onSelect: () => void
}) {
  const meta = CATEGORY_META[resource.category]

  return (
    <li>
      <button
        type="button"
        className={`resource-card ${selected ? 'selected' : ''}`}
        onClick={onSelect}
      >
        <div className={`resource-card-icon cat-${resource.category}`}>
          {meta.icon}
        </div>
        <div className="resource-card-body">
          <div className="resource-card-top">
            <strong>{resource.name}</strong>
            <span
              className={`badge ${resource.source === 'verified' ? 'verified' : 'community'}`}
            >
              {resource.source === 'verified' ? 'Verified' : 'Community'}
            </span>
          </div>
          <div className="resource-card-meta">
            <span className={`status-pill ${resource.openNow ? 'open' : 'closed'}`}>
              {resource.openNow ? 'Open' : 'Closed'}
            </span>
            <span className="meta">{formatDistance(resource.distanceMeters)}</span>
            <span className={`category-chip small cat-${resource.category}`}>
              {meta.label}
            </span>
          </div>
        </div>
      </button>
    </li>
  )
}
