import { useState } from 'react'
import { ArrowLeft, ArrowRight, Building2, Layers3, ListChecks, Route, ShieldCheck, Sparkles, Tag, TriangleAlert } from 'lucide-react'

import { aiGovernanceScenarios } from '../data/aiGovernanceScenarios'

const appliedUseCases = ['Shadow AI discovery', 'Agent access governance', 'Prompt injection & DLP', 'Action fabric']

export function PhaseOneExamplesPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scenario = aiGovernanceScenarios[activeIndex]

  const goTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= aiGovernanceScenarios.length) return
    setActiveIndex(nextIndex)
  }

  return (
    <main className="page-shell knowledge-page">
      <section className="knowledge-hero">
        <div>
          <span className="kb-eyebrow"><ShieldCheck size={15} /> Executive scenario portfolio</span>
          <h1>Phase 1 AI governance examples.</h1>
          <p>Ten industry scenarios showing how the phase-1 governance controls apply in real operating environments.</p>
        </div>
        <div className="kb-overview" aria-label="Scenario overview">
          <span><ListChecks size={18} /><strong>10</strong> scenarios</span>
          <span><Layers3 size={18} /><strong>4</strong> use cases each</span>
          <span><Route size={18} /><strong>1</strong> phase</span>
        </div>
      </section>

      <section className="knowledge-layout">
        <aside className="knowledge-rail">
          <div className="knowledge-rail-title">
            <span>Scenarios</span>
            <b>{activeIndex + 1} / {aiGovernanceScenarios.length}</b>
          </div>
          <div className="knowledge-tabs">
            {aiGovernanceScenarios.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={index === activeIndex ? 'active' : ''}
                onClick={() => goTo(index)}
              >
                <span>{index + 1}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
        </aside>

        <article className="knowledge-card">
          <header className="knowledge-card-header">
            <div className="knowledge-title-row">
              <span className="knowledge-number">{activeIndex + 1}</span>
              <div>
                <h2>{scenario.title}</h2>
                <span className="module-chip"><Building2 size={14} /> {scenario.industry}</span>
              </div>
            </div>
            <div className="kb-metrics">
              <div>
                <Layers3 size={16} />
                <span>Use cases</span>
                <strong>4 applied</strong>
              </div>
              <div>
                <Sparkles size={16} />
                <span>Stack items</span>
                <strong>{scenario.stack.length}</strong>
              </div>
            </div>
          </header>

          <div className="knowledge-content">
            <div className="kb-two-col">
              <section className="kb-field">
                <h3><Building2 size={16} /> What this is</h3>
                <p>{scenario.what}</p>
              </section>
              <section className="kb-field kb-soft">
                <h3><TriangleAlert size={16} /> Why governance matters here</h3>
                <p>{scenario.why}</p>
              </section>
            </div>

            <section className="scenario-usecases">
              <h3><Layers3 size={16} /> How we apply all 4 use cases</h3>
              <div className="scenario-grid">
                {scenario.ucs.map((useCase, index) => (
                  <div key={useCase.h} className={`scenario-mini-card mini-${index + 1}`}>
                    <span>{appliedUseCases[index]}</span>
                    <strong>{useCase.h}</strong>
                    <p>{useCase.b}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="kb-field">
              <h3><Layers3 size={16} /> Tech stack</h3>
              <div className="kb-tags scenario-tags">
                {scenario.stack.map((stackItem, index) => (
                  <span key={stackItem} className={scenario.stackc[index]}>{stackItem}</span>
                ))}
              </div>
            </section>

            <section className="real-world-panel">
              <h3><Building2 size={16} /> Real-world scenario</h3>
              <p>{scenario.rw}</p>
              <span><Tag size={15} /> {scenario.org}</span>
            </section>

            <div className="knowledge-pager">
              <button type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}>
                <ArrowLeft size={16} /> Prev
              </button>
              <span>{activeIndex + 1} of {aiGovernanceScenarios.length}</span>
              <button type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === aiGovernanceScenarios.length - 1}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
