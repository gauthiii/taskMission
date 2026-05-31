import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AppNav } from './components/AppNav'
import { membersSeed, tasksSeed } from './data/mockData'
import { MembersPage } from './pages/MembersPage'
import { PhaseOneExamplesPage } from './pages/PhaseOneExamplesPage'
import { TaskBoardPage } from './pages/TaskBoardPage'
import { UseCasesPage } from './pages/UseCasesPage'
import type { Member, MemberDraft, Task, TaskDraft } from './types'

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

export default function App() {
  const [members, setMembers] = useState<Member[]>(membersSeed)
  const [tasks, setTasks] = useState<Task[]>(tasksSeed)

  const taskMetrics = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const overdue = tasks.filter((task) => task.status !== 'done' && new Date(task.deadline) < today).length
    const atRisk = tasks.filter((task) => {
      if (task.status === 'done') return false
      const deadline = new Date(task.deadline)
      const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000)
      return daysLeft <= 3 || task.status === 'blocked'
    }).length
    const completed = tasks.filter((task) => task.status === 'done').length
    const averageProgress = tasks.length
      ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
      : 0

    return { total: tasks.length, completed, atRisk, overdue, averageProgress }
  }, [tasks])

  const addTask = (draft: TaskDraft) => {
    setTasks((current) => [{ ...draft, id: createId('task') }, ...current])
  }

  const updateTask = (taskId: string, patch: Partial<Task>) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task
        const next = { ...task, ...patch }
        if (patch.status === 'done') next.progress = 100
        if (patch.progress !== undefined && patch.progress >= 100) next.status = 'done'
        return next
      }),
    )
  }

  const addMember = (draft: MemberDraft) => {
    setMembers((current) => [{ ...draft, id: createId('member') }, ...current])
  }

  const updateMember = (memberId: string, patch: Partial<Member>) => {
    setMembers((current) =>
      current.map((member) => (member.id === memberId ? { ...member, ...patch } : member)),
    )
  }

  return (
    <div className="app-shell">
      <AppNav metrics={taskMetrics} />
      <Routes>
        <Route
          path="/"
          element={
            <TaskBoardPage
              members={members}
              tasks={tasks}
              metrics={taskMetrics}
              onAddTask={addTask}
              onUpdateTask={updateTask}
            />
          }
        />
        <Route
          path="/members"
          element={
            <MembersPage
              members={members}
              tasks={tasks}
              onAddMember={addMember}
              onUpdateMember={updateMember}
            />
          }
        />
        <Route path="/use-cases" element={<UseCasesPage />} />
        <Route path="/phase-1-examples" element={<PhaseOneExamplesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
