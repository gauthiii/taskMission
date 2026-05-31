import React, { useState } from 'react'
import MarkdownViewer, { ParsedPlan } from '../components/MarkdownViewer'
import PlanVisualizer from '../components/PlanVisualizer'

export function HiddenPage() {
  const [parsed, setParsed] = useState<ParsedPlan | undefined>(undefined)

  return (
    <div className="hidden-page page-shell">
      <div className="hidden-grid">
        <main className="plan-content">
          <MarkdownViewer onParse={(p) => setParsed(p)} />
        </main>

        <aside className="plan-side">
          <PlanVisualizer parsed={parsed} />
        </aside>
      </div>
    </div>
  )
}

export default HiddenPage
