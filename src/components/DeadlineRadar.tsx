import { Radar, TimerReset } from 'lucide-react'

import type { Task } from '../types'

type DeadlineRadarProps = {
  tasks: Task[]
}

export function DeadlineRadar({ tasks }: DeadlineRadarProps) {
  const upcoming = [...tasks]
    .filter((task) => task.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 6)

  return (
    <aside className="deadline-radar">
      <div className="radar-header">
        <span>
          <Radar size={18} />
          Deadline radar
        </span>
        <TimerReset size={18} />
      </div>
      <div className="radar-track">
        {upcoming.map((task, index) => (
          <div key={task.id} className={`radar-item status-${task.status}`}>
            <span className="radar-dot">{index + 1}</span>
            <div>
              <strong>{task.title}</strong>
              <small>
                {new Date(`${task.deadline}T00:00:00`).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </small>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
