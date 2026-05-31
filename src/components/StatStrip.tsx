import { AlertTriangle, BarChart3, CheckCircle2, Flame, ListChecks } from 'lucide-react'

type StatStripProps = {
  metrics: {
    total: number
    completed: number
    atRisk: number
    overdue: number
    averageProgress: number
  }
}

export function StatStrip({ metrics }: StatStripProps) {
  const stats = [
    { label: 'Total tasks', value: metrics.total, icon: ListChecks, tone: 'blue' },
    { label: 'Completed', value: metrics.completed, icon: CheckCircle2, tone: 'green' },
    { label: 'At risk', value: metrics.atRisk, icon: AlertTriangle, tone: 'amber' },
    { label: 'Overdue', value: metrics.overdue, icon: Flame, tone: 'red' },
    { label: 'Avg progress', value: `${metrics.averageProgress}%`, icon: BarChart3, tone: 'violet' },
  ] as const

  return (
    <section className="stat-strip" aria-label="Mission summary">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className={`stat-card tone-${tone}`}>
          <Icon size={21} />
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  )
}
