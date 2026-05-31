import React, { useState } from 'react'
import { Radar, TimerReset } from 'lucide-react'

import type { Task } from '../types'

type DeadlineRadarProps = {
  tasks: Task[]
}

export function DeadlineRadar({ tasks }: DeadlineRadarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const upcoming = [...tasks]
    .filter((task) => task.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 6)

  const handleToggle = (e?: React.MouseEvent) => {
    e && e.stopPropagation()
    setCollapsed((c) => {
      const next = !c
      try {
        if (next) document.body.classList.add('radar-collapsed')
        else document.body.classList.remove('radar-collapsed')
      } catch (err) {}
      return next
    })
  }

  // ensure body class is in sync if component mounts/unmounts
  React.useEffect(() => {
    if (collapsed) document.body.classList.add('radar-collapsed')
    return () => {
      document.body.classList.remove('radar-collapsed')
    }
  }, [collapsed])

  return (
    <aside
      className={`deadline-radar ${collapsed ? 'collapsed' : ''}`}
      onClick={() => collapsed && setCollapsed(false)}
      role="region"
      aria-label="Deadline radar"
    >
      <div className="radar-header">
        <span>
          <Radar size={18} />
          {!collapsed && 'Deadline radar'}
        </span>
        <button
          className="icon-button"
          aria-pressed={collapsed}
          onClick={handleToggle}
          title={collapsed ? 'Expand deadline radar' : 'Minimize deadline radar'}
        >
          <TimerReset size={18} />
        </button>
      </div>

      {!collapsed && (
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
      )}
      {collapsed && (
        <div className="radar-mini" onClick={() => setCollapsed(false)}>
          <div className="radar-mini-label">Deadline radar — click to expand</div>
        </div>
      )}
    </aside>
  )
}
