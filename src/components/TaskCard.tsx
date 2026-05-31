import { CalendarClock, Check, Minus, Plus, UserRound } from 'lucide-react'

import type { Member, Priority, Task, TaskStatus } from '../types'

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'queued', label: 'Queued' },
  { value: 'in-motion', label: 'In Motion' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
]

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

function getDeadlineTone(deadline: string, status: TaskStatus) {
  if (status === 'done') return 'calm'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(deadline)
  const daysLeft = Math.ceil((due.getTime() - today.getTime()) / 86_400_000)
  if (daysLeft < 0) return 'overdue'
  if (daysLeft <= 3) return 'soon'
  return 'open'
}

type TaskCardProps = {
  task: Task
  members: Member[]
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void
}

export function TaskCard({ task, members, onUpdateTask }: TaskCardProps) {
  const assignees = task.assigneeIds
    .map((id) => members.find((member) => member.id === id))
    .filter((member): member is Member => Boolean(member))
  const deadlineTone = getDeadlineTone(task.deadline, task.status)

  const moveProgress = (amount: number) => {
    onUpdateTask(task.id, { progress: Math.min(100, Math.max(0, task.progress + amount)) })
  }

  return (
    <article className={`task-card priority-${task.priority}`}>
      <div className="task-card-route" />
      <div className="task-card-topline">
        <span className={`priority-badge ${task.priority}`}>{priorityLabels[task.priority]}</span>
        <span className={`deadline-chip ${deadlineTone}`}>
          <CalendarClock size={13} />
          {new Date(`${task.deadline}T00:00:00`).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div className="tag-row">
        {task.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <div className="assignee-row">
        {assignees.length ? (
          assignees.map((member) => (
            <span key={member.id} className="avatar-chip" title={member.name}>
              <i style={{ background: member.color }}>{member.name.slice(0, 1)}</i>
              {member.name.split(' ')[0]}
            </span>
          ))
        ) : (
          <span className="avatar-chip empty">
            <UserRound size={14} />
            Unassigned
          </span>
        )}
      </div>

      <div className="progress-block">
        <div className="progress-label">
          <span>Progress</span>
          <strong>{task.progress}%</strong>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={task.progress}
          onChange={(event) => onUpdateTask(task.id, { progress: Number(event.target.value) })}
          aria-label={`Progress for ${task.title}`}
        />
        <div className="progress-actions">
          <button type="button" onClick={() => moveProgress(-10)} aria-label="Decrease progress">
            <Minus size={14} />
          </button>
          <button type="button" onClick={() => moveProgress(10)} aria-label="Increase progress">
            <Plus size={14} />
          </button>
          <button type="button" onClick={() => onUpdateTask(task.id, { status: 'done', progress: 100 })}>
            <Check size={14} />
            Done
          </button>
        </div>
      </div>

      <label className="status-select">
        <span>Status</span>
        <select
          value={task.status}
          onChange={(event) => onUpdateTask(task.id, { status: event.target.value as TaskStatus })}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </article>
  )
}
