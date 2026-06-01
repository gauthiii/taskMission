import { useState } from 'react'
import { ClipboardList, Filter, LayoutDashboard, ListChecks } from 'lucide-react'

import { DeadlineRadar } from '../components/DeadlineRadar'
import { StatStrip } from '../components/StatStrip'
import { TaskCard } from '../components/TaskCard'
import { TaskForm } from '../components/TaskForm'
import { TaskTable } from '../components/TaskTable'
import type { Member, Task, TaskDraft, TaskStatus } from '../types'

const lanes: Array<{ status: TaskStatus; label: string; cue: string }> = [
  { status: 'queued', label: 'Queued', cue: 'Ready for launch' },
  { status: 'in-motion', label: 'In Motion', cue: 'Moving across the route' },
  { status: 'blocked', label: 'Blocked', cue: 'Needs intervention' },
  { status: 'review', label: 'Review', cue: 'Final inspection' },
  { status: 'done', label: 'Done', cue: 'Mission complete' },
]

type TaskBoardPageProps = {
  members: Member[]
  tasks: Task[]
  metrics: {
    total: number
    completed: number
    atRisk: number
    overdue: number
    averageProgress: number
  }
  onAddTask: (draft: TaskDraft) => void
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  isLoadingTasks: boolean
  tasksError: string | null
}

type BoardView = 'board' | 'tasks'

export function TaskBoardPage({
  members,
  tasks,
  metrics,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  isLoadingTasks,
  tasksError,
}: TaskBoardPageProps) {
  const [view, setView] = useState<BoardView>('board')

  return (
    <main className="page-shell">
      <section className="hero-band">
        <div>
          <span className="eyebrow">Live board</span>
          <h1>Mission control for team tasks, deadlines, and progress.</h1>
          <p>
            Add work, assign the crew, tune progress, and spot deadline heat from one bright operating surface.
          </p>
        </div>
        <div className="hero-actions">
          <div className="board-view-toggle" aria-label="Task view toggle">
            <button
              type="button"
              className={view === 'board' ? 'active' : ''}
              onClick={() => setView('board')}
            >
              <LayoutDashboard size={16} />
              Board
            </button>
            <button
              type="button"
              className={view === 'tasks' ? 'active' : ''}
              onClick={() => setView('tasks')}
            >
              <ListChecks size={16} />
              All Tasks
            </button>
          </div>
          <TaskForm members={members} onAddTask={onAddTask} />
        </div>
      </section>

      <StatStrip metrics={metrics} />

      {(isLoadingTasks || tasksError) && (
        <section className={tasksError ? 'task-sync-banner error' : 'task-sync-banner'}>
          {tasksError ? `Task sync failed: ${tasksError}` : 'Loading tasks from Firestore...'}
        </section>
      )}

      {view === 'board' ? (
        <section className="mission-grid">
          <div className="board-panel">
            <div className="board-header">
              <div>
                <span className="eyebrow">Task lanes</span>
                <h2><ClipboardList size={22} /> Progress board</h2>
              </div>
              <span className="filter-stamp"><Filter size={15} /> All missions</span>
            </div>

            <div className="lane-grid">
              {lanes.map((lane) => {
                const laneTasks = tasks.filter((task) => task.status === lane.status)
                return (
                  <section key={lane.status} className={`lane lane-${lane.status}`}>
                    <div className="lane-header">
                      <span>
                        <strong>{lane.label}</strong>
                        <small>{lane.cue}</small>
                      </span>
                      <b>{laneTasks.length}</b>
                    </div>
                    <div className="lane-stack">
                      {laneTasks.length ? (
                        laneTasks.map((task) => (
                          <TaskCard key={task.id} task={task} members={members} onUpdateTask={onUpdateTask} />
                        ))
                      ) : (
                        <div className="empty-lane">No tasks in this lane yet.</div>
                      )}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>

          <DeadlineRadar tasks={tasks} />
        </section>
      ) : (
        <TaskTable members={members} tasks={tasks} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} />
      )}
    </main>
  )
}
