import { useState } from 'react'
import { postReport } from './api'
import type { ReportType } from './types'

const REPORTS: { type: ReportType; label: string }[] = [
  { type: 'closed', label: 'Closed' },
  { type: 'wrong_info', label: 'Wrong info' },
  { type: 'gone', label: 'No longer there' },
]

export function ReportActions({ resourceId }: { resourceId: string }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const send = async (type: ReportType) => {
    setBusy(true)
    setMessage(null)
    try {
      await postReport(resourceId, type)
      setMessage('Report sent — thank you.')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Report failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="reports">
      <h3>Report an issue</h3>
      <div className="report-btns">
        {REPORTS.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            className="btn secondary small"
            disabled={busy}
            onClick={() => void send(type)}
          >
            {label}
          </button>
        ))}
      </div>
      {message && (
        <p className={message.includes('thank') ? 'success' : 'error'}>
          {message}
        </p>
      )}
    </div>
  )
}
