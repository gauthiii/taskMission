import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'

import type { Member, Priority, TaskDraft, TaskStatus } from '../types'

const today = new Date().toISOString().slice(0, 10)

const statuses: Array<{ value: TaskStatus; label: string }> = [
  { value: 'queued', label: 'Queued' },
  { value: 'in-motion', label: 'In Motion' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
]

const priorities: Priority[] = ['low', 'medium', 'high', 'critical']

type TaskFormProps = {
  members: Member[]
  onAddTask: (draft: TaskDraft) => void
}

export function TaskForm({ members, onAddTask }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('queued')
  const [priority, setPriority] = useState<Priority>('medium')
  const [startDate, setStartDate] = useState(today)
  const [deadline, setDeadline] = useState(today)
  const [progress, setProgress] = useState(10)
  const [assigneeIds, setAssigneeIds] = useState<string[]>(members.slice(0, 2).map((member) => member.id))
  const [tagsInput, setTagsInput] = useState('new, mission')

  const tags = useMemo(
    () => tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean),
    [tagsInput],
  )

  const reset = () => {
    setTitle('')
    setDescription('')
    setStatus('queued')
    setPriority('medium')
    setStartDate(today)
    setDeadline(today)
    setProgress(10)
    setAssigneeIds(members.slice(0, 2).map((member) => member.id))
    setTagsInput('new, mission')
  }

  const toggleAssignee = (memberId: string) => {
    setAssigneeIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    )
  }

  const submitTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      description: description.trim() || 'No notes added yet.',
      status,
      priority,
      startDate,
      deadline,
      progress: status === 'done' ? 100 : progress,
      assigneeIds,
      tags,
    })
    reset()
    setIsOpen(false)
  }

  return (
    <>
      <button type="button" className="launch-button" onClick={() => setIsOpen(true)}>
        <Plus size={18} />
        Add Task
      </button>

      {isOpen && (
        <div className="drawer-backdrop" role="presentation">
          <form className="drawer-panel" onSubmit={submitTask}>
            <div className="drawer-header">
              <div>
                <span className="eyebrow">Launch panel</span>
                <h2>Add mission task</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setIsOpen(false)} aria-label="Close form">
                <X size={18} />
              </button>
            </div>

            <label>
              Task title
              <input value={title} onChange={(event) => setTitle(event.target.value)} required />
            </label>

            <label>
              Description
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
            </label>

            <div className="form-grid">
              <label>
                Status
                <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
                  {statuses.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Priority
                <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
                  {priorities.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-grid">
              <label>
                Start date
                <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </label>
              <label>
                Deadline
                <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
              </label>
            </div>

            <label>
              Progress: {progress}%
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(event) => setProgress(Number(event.target.value))}
              />
            </label>

            <div className="member-picker">
              <span>Assign members</span>
              <div>
                {members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    className={assigneeIds.includes(member.id) ? 'selected' : ''}
                    onClick={() => toggleAssignee(member.id)}
                  >
                    <i style={{ background: member.color }}>{member.name.slice(0, 1)}</i>
                    {member.name}
                  </button>
                ))}
              </div>
            </div>

            <label>
              Tags
              <input value={tagsInput} onChange={(event) => setTagsInput(event.target.value)} />
            </label>

            <button type="submit" className="submit-button">
              <Plus size={18} />
              Create task
            </button>
          </form>
        </div>
      )}
    </>
  )
}
