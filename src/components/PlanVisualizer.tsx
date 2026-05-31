import React, { useEffect, useState } from 'react'
import type { ParsedPlan } from './MarkdownViewer'

type Props = { parsed?: ParsedPlan }

export function PlanVisualizer({ parsed }: Props) {
  const [checkState, setCheckState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const raw = localStorage.getItem('hiddenPlan.progress.v1')
    if (raw) setCheckState(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('hiddenPlan.progress.v1', JSON.stringify(checkState))
  }, [checkState])

  if (!parsed) return <div className="plan-visualizer">Loading summary…</div>

  const milestones = parsed.groups.filter((g) => /day\s*\d+/i.test(g.heading.text) || /milestone/i.test(g.heading.text))
  const resources = parsed.groups.filter((g) => /resource|allocation|team/i.test(g.heading.text))

  return (
    <aside className="plan-visualizer">
      <div className="plan-card main-card">
        <h3>{parsed.title ?? 'Project Plan'}</h3>
        <p className="muted">Auto-extracted plan summary</p>
        <div style={{ marginTop: 12 }}>
          <strong>Headings:</strong> {parsed.headings.length} &nbsp; • &nbsp;
          <strong>Milestones:</strong> {milestones.length} &nbsp; • &nbsp;
          <strong>Resources:</strong> {resources.length}
        </div>
        <div style={{ marginTop: 12 }}>
          <label className="progress-label">Completion</label>
          <div className="workload-meter" style={{ marginTop: 8 }}>
            <span style={{ display: 'block', width: `${Math.round((Object.values(checkState).filter(Boolean).length / Math.max(1, Object.keys(checkState).length)) * 100)}%`, background: '#16a34a' }} />
          </div>
        </div>
      </div>
    </aside>
  )
}

export default PlanVisualizer
