import { useState } from 'react'
import { ArrowLeft, ArrowRight, BadgeCheck, Clock, Coins, Layers3, ListChecks, ShieldCheck, Sparkles, Target, UsersRound, Wrench } from 'lucide-react'

import { aiGovernanceUseCases } from '../data/aiGovernanceUseCases'

const phaseOneIndexes = new Set([0, 1, 5, 8])
const complexityLabels = ['', 'Low', 'Low-med', 'Medium', 'Med-high', 'High']

export function UseCasesPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const useCase = aiGovernanceUseCases[activeIndex]

  const goTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= aiGovernanceUseCases.length) return
    setActiveIndex(nextIndex)
  }

  return (
    <main className="page-shell knowledge-page">
      <section className="knowledge-hero">
        <div>
          <span className="kb-eyebrow"><ShieldCheck size={15} /> Executive use-case portfolio</span>
          <h1>ServiceNow AI governance and security use cases.</h1>
          <p>Initial knowledge base for AI Control Tower, IRM, SecOps, TPRM, access governance, and action fabric patterns.</p>
        </div>
        <div className="kb-overview" aria-label="Use case overview">
          <span><ListChecks size={18} /><strong>10</strong> use cases</span>
          <span><Layers3 size={18} /><strong>4</strong> core modules</span>
          <span><Sparkles size={18} /><strong>4</strong> phase 1 picks</span>
        </div>
      </section>

      <section className="knowledge-layout">
        <aside className="knowledge-rail">
          <div className="knowledge-rail-title">
            <span>Use cases</span>
            <b>{activeIndex + 1} / {aiGovernanceUseCases.length}</b>
          </div>
          <div className="knowledge-tabs">
            {aiGovernanceUseCases.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={index === activeIndex ? 'active' : ''}
                onClick={() => goTo(index)}
              >
                <span>{index + 1}</span>
                <strong>{item.title}</strong>
                {phaseOneIndexes.has(index) && <em>Phase 1</em>}
              </button>
            ))}
          </div>
        </aside>

        <article className="knowledge-card">
          <header className="knowledge-card-header">
            <div className="knowledge-title-row">
              <span className="knowledge-number">{activeIndex + 1}</span>
              <div>
                <div className="knowledge-heading-line">
                  <h2>{useCase.title}</h2>
                  {phaseOneIndexes.has(activeIndex) && (
                    <span className="phase-badge"><BadgeCheck size={15} /> MARKED FOR PHASE 1</span>
                  )}
                </div>
                <span className="module-chip">{useCase.module}</span>
              </div>
            </div>
            <div className="kb-metrics">
              <div>
                <Coins size={16} />
                <span>Savings</span>
                <strong>{useCase.savings}</strong>
              </div>
              <div>
                <Clock size={16} />
                <span>Duration</span>
                <strong>{useCase.duration}</strong>
              </div>
            </div>
          </header>

          <div className="knowledge-content">
            <div className="kb-two-col">
              <section className="kb-field">
                <h3><Target size={16} /> Use case</h3>
                <p>{useCase.useCase}</p>
              </section>
              <section className="kb-field kb-soft">
                <h3><UsersRound size={16} /> Who benefits</h3>
                <p>{useCase.benefits}</p>
              </section>
            </div>

            <section className="kb-field">
              <h3><Wrench size={16} /> How we do it</h3>
              <p>{useCase.howWeDo}</p>
            </section>

            <div className="kb-two-col kb-bottom-grid">
              <section className="kb-field">
                <h3><Layers3 size={16} /> The stack</h3>
                <div className="kb-tags">
                  {useCase.stack.map((stackItem) => <span key={stackItem}>{stackItem}</span>)}
                </div>
              </section>
              <section className="kb-field">
                <h3><Sparkles size={16} /> Complexity</h3>
                <div className="complexity-row">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={index} className={index < useCase.complexity ? 'filled' : ''} />
                  ))}
                  <strong>{complexityLabels[useCase.complexity]}</strong>
                </div>
                <div className="savings-track">
                  <span style={{ width: `${useCase.savingsPct}%` }} />
                </div>
                <p className="kb-note">{useCase.savingsNote}</p>
              </section>
            </div>

            <div className="knowledge-pager">
              <button type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}>
                <ArrowLeft size={16} /> Prev
              </button>
              <span>{activeIndex + 1} of {aiGovernanceUseCases.length}</span>
              <button type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === aiGovernanceUseCases.length - 1}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
