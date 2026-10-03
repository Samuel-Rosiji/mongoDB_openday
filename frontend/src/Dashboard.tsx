import { useEffect, useState } from 'react'
import { fetchStats } from './api'
import { CATEGORIES, type StatsResponse } from './types'

export function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'Failed to load stats'),
      )
  }, [])

  if (error) {
    return (
      <div className="dashboard-page">
        <p className="error">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="dashboard-page">
        <p className="meta">Loading impact metrics…</p>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h2>Impact overview</h2>
        <p className="meta">
          Live counts from MongoDB aggregations (demo data until API is wired).
        </p>
      </header>
      <div className="stat-grid">
        <div className="stat-card stat-total">
          <span className="stat-value">{stats.totalResources}</span>
          <span className="stat-label">Resources listed</span>
        </div>
        <div className="stat-card stat-verified">
          <span className="stat-value">{stats.verified}</span>
          <span className="stat-label">Verified (official)</span>
        </div>
        <div className="stat-card stat-community">
          <span className="stat-value">{stats.community}</span>
          <span className="stat-label">Community posted</span>
        </div>
        <div className="stat-card stat-reports">
          <span className="stat-value">{stats.pendingReports}</span>
          <span className="stat-label">Reports to review</span>
        </div>
      </div>
      <section className="dashboard-panel">
        <h3>Coverage by category</h3>
        <ul className="category-stats">
          {CATEGORIES.map(({ id, label }) => (
            <li key={id}>
              <span>{label}</span>
              <strong>{stats.byCategory[id] ?? 0}</strong>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
