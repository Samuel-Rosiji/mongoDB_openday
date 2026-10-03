import { useEffect, useRef } from 'react'
import { ReportActions } from './ReportActions'
import { CATEGORY_META, type Resource } from './types'

function formatDistance(m?: number) {
  if (m == null) return null
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
}

export function ResourceDetail({ resource }: { resource: Resource }) {
  const dist = formatDistance(resource.distanceMeters)
  const ref = useRef<HTMLElement>(null)
  const meta = CATEGORY_META[resource.category]

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [resource.id])

  return (
    <section
      ref={ref}
      id="resource-detail"
      className={`panel detail detail-highlight cat-${resource.category}`}
      aria-live="polite"
    >
      <div className={`detail-hero cat-${resource.category}`}>
        <span className="detail-hero-icon" aria-hidden="true">{meta.icon}</span>
        <div>
          <span className="detail-hero-label">{meta.label}</span>
          <span className="detail-hero-blurb">{meta.blurb}</span>
        </div>
      </div>
      <h2 className="detail-title">{resource.name}</h2>
      <div className="detail-badges">
        <span
          className={`badge ${resource.source === 'verified' ? 'verified' : 'community'}`}
        >
          {resource.source === 'verified' ? '✓ Verified' : 'Community'}
        </span>
        <span className={`status-pill ${resource.openNow ? 'open' : 'closed'}`}>
          {resource.openNow ? 'Open now' : 'Closed'}
        </span>
        {dist && <span className="detail-distance">{dist}</span>}
      </div>
      <p className="detail-description">{resource.description}</p>
      {resource.hours && (
        <p className="detail-row">
          <span className="detail-label">Hours</span>
          {resource.hours}
        </p>
      )}
      {resource.contact && (
        <p className="detail-row">
          <span className="detail-label">Contact</span>
          {resource.contact}
        </p>
      )}
      <ReportActions resourceId={resource.id} />
    </section>
  )
}
