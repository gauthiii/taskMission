import { useMemo, useState, type FormEvent } from 'react'
import { Pencil, Save, Trash2, X } from 'lucide-react'

import type { Member, Priority, Task, TaskDraft, TaskStatus } from '../types'

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'queued', label: 'Queued' },
  { value: 'in-motion', label: 'In Motion' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
]

const priorities: Priority[] = ['low', 'medium', 'high', 'critical']

type TaskTableProps = {
  members: Member[]
  tasks: Task[]
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void | Promise<void>
  onDeleteTask: (taskId: string) => void | Promise<void>
}

type EditDraft = TaskDraft & {
  tagsInput: string
}

const createDraft = (task: Task): EditDraft => ({
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  startDate: task.startDate,
  deadline: task.deadline,
  progress: task.progress,
  assigneeIds: task.assigneeIds,
  tags: task.tags,
  tagsInput: task.tags.join(', '),
})

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export function TaskTable({ members, tasks, onUpdateTask, onDeleteTask }: TaskTableProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [draft, setDraft] = useState<EditDraft | null>(null)
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const membersById = useMemo(() => {
    const map = new Map<string, Member>()
    members.forEach((member) => map.set(member.id, member))
    return map
  }, [members])

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setDraft(createDraft(task))
    setError(null)
  }

  const cancelEditing = () => {
    setEditingTaskId(null)
    setDraft(null)
    setError(null)
  }

  const updateDraft = <Key extends keyof EditDraft>(key: Key, value: EditDraft[Key]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current)
  }

  const toggleAssignee = (memberId: string) => {
    setDraft((current) => {
      if (!current) return current
      const assigneeIds = current.assigneeIds.includes(memberId)
        ? current.assigneeIds.filter((id) => id !== memberId)
        : [...current.assigneeIds, memberId]
      return { ...current, assigneeIds }
    })
  }

  const saveTask = async (event: FormEvent<HTMLFormElement>, taskId: string) => {
    event.preventDefault()
    if (!draft || !draft.title.trim()) return

    setSavingTaskId(taskId)
    setError(null)

    try {
      await onUpdateTask(taskId, {
        title: draft.title.trim(),
        description: draft.description.trim() || 'No notes added yet.',
        status: draft.status,
        priority: draft.priority,
        startDate: draft.startDate,
        deadline: draft.deadline,
        progress: draft.status === 'done' ? 100 : draft.progress,
        assigneeIds: draft.assigneeIds,
        tags: draft.tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean),
      })
      cancelEditing()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save task.')
    } finally {
      setSavingTaskId(null)
    }
  }

  const deleteTask = async (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return

    setSavingTaskId(task.id)
    setError(null)

    try {
      await onDeleteTask(task.id)
      if (editingTaskId === task.id) cancelEditing()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete task.')
    } finally {
      setSavingTaskId(null)
    }
  }

  if (!tasks.length) {
    return (
      <section className="task-table-panel">
        <div className="task-table-header">
          <div>
            <span className="eyebrow">All tasks</span>
            <h2>Task table</h2>
          </div>
        </div>
        <div className="task-table-empty">No tasks have been created yet.</div>
      </section>
    )
  }

  return (
    <section className="task-table-panel">
      <div className="task-table-header">
        <div>
          <span className="eyebrow">All tasks</span>
          <h2>Task table</h2>
        </div>
        <span className="filter-stamp">{tasks.length} total</span>
      </div>

      {error && <div className="task-table-error">{error}</div>}

      <div className="task-table-wrap">
        <table className="task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignees</th>
              <th>Start</th>
              <th>Deadline</th>
              <th>Progress</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const isEditing = editingTaskId === task.id && draft
              const assignees = task.assigneeIds
                .map((memberId) => membersById.get(memberId))
                .filter((member): member is Member => Boolean(member))

              if (isEditing) {
                return (
                  <tr key={task.id} className="task-table-edit-row">
                    <td colSpan={9}>
                      <form className="task-row-editor" onSubmit={(event) => saveTask(event, task.id)}>
                        <div className="task-edit-grid">
                          <label>
                            Title
                            <input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} required />
                          </label>
                          <label>
                            Status
                            <select value={draft.status} onChange={(event) => updateDraft('status', event.target.value as TaskStatus)}>
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Priority
                            <select value={draft.priority} onChange={(event) => updateDraft('priority', event.target.value as Priority)}>
                              {priorities.map((priority) => (
                                <option key={priority} value={priority}>{priority}</option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Start date
                            <input type="date" value={draft.startDate} onChange={(event) => updateDraft('startDate', event.target.value)} />
                          </label>
                          <label>
                            Deadline
                            <input type="date" value={draft.deadline} onChange={(event) => updateDraft('deadline', event.target.value)} />
                          </label>
                          <label>
                            Progress: {draft.status === 'done' ? 100 : draft.progress}%
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={draft.status === 'done' ? 100 : draft.progress}
                              disabled={draft.status === 'done'}
                              onChange={(event) => updateDraft('progress', Number(event.target.value))}
                            />
                          </label>
                        </div>

                        <label>
                          Description
                          <textarea
                            value={draft.description}
                            rows={3}
                            onChange={(event) => updateDraft('description', event.target.value)}
                          />
                        </label>

                        <div className="member-picker task-table-member-picker">
                          <span>Assign members</span>
                          <div>
                            {members.map((member) => (
                              <button
                                key={member.id}
                                type="button"
                                className={draft.assigneeIds.includes(member.id) ? 'selected' : ''}
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
                          <input value={draft.tagsInput} onChange={(event) => updateDraft('tagsInput', event.target.value)} />
                        </label>

                        <div className="task-row-actions">
                          <button type="submit" disabled={savingTaskId === task.id}>
                            <Save size={14} />
                            {savingTaskId === task.id ? 'Saving...' : 'Save'}
                          </button>
                          <button type="button" onClick={cancelEditing}>
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                    <small>{task.description}</small>
                  </td>
                  <td><span className={`task-table-status status-${task.status}`}>{statusOptions.find((option) => option.value === task.status)?.label}</span></td>
                  <td><span className={`priority-badge ${task.priority}`}>{task.priority}</span></td>
                  <td>
                    <div className="task-table-assignees">
                      {assignees.length ? assignees.map((member) => (
                        <span key={member.id} className="avatar-chip">
                          <i style={{ background: member.color }}>{member.name.slice(0, 1)}</i>
                          {member.name.split(' ')[0]}
                        </span>
                      )) : <span className="muted">Unassigned</span>}
                    </div>
                  </td>
                  <td>{formatDate(task.startDate)}</td>
                  <td>{formatDate(task.deadline)}</td>
                  <td>
                    <div className="task-table-progress">
                      <span>{task.progress}%</span>
                      <meter min="0" max="100" value={task.progress} />
                    </div>
                  </td>
                  <td>
                    <div className="task-table-tags">
                      {task.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                    </div>
                  </td>
                  <td>
                    <div className="task-table-actions">
                      <button type="button" onClick={() => startEditing(task)}>
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button type="button" className="danger" disabled={savingTaskId === task.id} onClick={() => void deleteTask(task)}>
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
