import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

import { AppNav } from './components/AppNav'
import { membersSeed } from './data/mockData'
import { db } from './firebase'
import { useAuth } from './hooks/useAuth'
import { MembersPage } from './pages/MembersPage'
import { PhaseOneExamplesPage } from './pages/PhaseOneExamplesPage'
import { ProgressPage } from './pages/ProgressPage'
import { TaskBoardPage } from './pages/TaskBoardPage'
import { UseCasesPage } from './pages/UseCasesPage'
import { SignInPage } from './components/SignInPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HiddenPage } from './pages/HiddenPage'
import type { Member, MemberDraft, Priority, Task, TaskDraft, TaskStatus } from './types'

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`
const TASKS_COLLECTION = 'tasks'

const taskStatuses: TaskStatus[] = ['queued', 'in-motion', 'blocked', 'review', 'done']
const priorities: Priority[] = ['low', 'medium', 'high', 'critical']

const isTaskStatus = (value: unknown): value is TaskStatus =>
  typeof value === 'string' && taskStatuses.includes(value as TaskStatus)

const isPriority = (value: unknown): value is Priority =>
  typeof value === 'string' && priorities.includes(value as Priority)

const normalizeTaskDocument = (id: string, data: unknown): Task | null => {
  if (!data || typeof data !== 'object') return null
  const task = data as Partial<Task>

  if (
    typeof task.title !== 'string' ||
    typeof task.description !== 'string' ||
    !isTaskStatus(task.status) ||
    !isPriority(task.priority) ||
    typeof task.startDate !== 'string' ||
    typeof task.deadline !== 'string' ||
    typeof task.progress !== 'number' ||
    !Array.isArray(task.assigneeIds) ||
    !Array.isArray(task.tags)
  ) {
    return null
  }

  return {
    id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    startDate: task.startDate,
    deadline: task.deadline,
    progress: Math.min(100, Math.max(0, task.progress)),
    assigneeIds: task.assigneeIds.filter((assigneeId): assigneeId is string => typeof assigneeId === 'string'),
    tags: task.tags.filter((tag): tag is string => typeof tag === 'string'),
  }
}

export default function App() {
  const { user } = useAuth()
  const [members, setMembers] = useState<Member[]>(membersSeed)
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [tasksError, setTasksError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setTasks([])
      setTasksLoading(false)
      return
    }

    setTasksLoading(true)
    setTasksError(null)

    const unsubscribe = onSnapshot(
      collection(db, TASKS_COLLECTION),
      (snapshot) => {
        const nextTasks = snapshot.docs
          .map((taskDoc) => normalizeTaskDocument(taskDoc.id, taskDoc.data()))
          .filter((task): task is Task => Boolean(task))
          .sort((a, b) => a.deadline.localeCompare(b.deadline) || a.title.localeCompare(b.title))

        setTasks(nextTasks)
        setTasksLoading(false)
      },
      (error) => {
        setTasksError(error.message)
        setTasksLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

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

  const addTask = async (draft: TaskDraft) => {
    const id = createId('task')
    const task: Task = { ...draft, id }

    await setDoc(doc(db, TASKS_COLLECTION, id), {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid ?? user?.email ?? null,
    })
  }

  const updateTask = async (taskId: string, patch: Partial<Task>) => {
    const currentTask = tasks.find((task) => task.id === taskId)
    if (!currentTask) return

    const nextTask = { ...currentTask, ...patch }
    if (patch.status === 'done') nextTask.progress = 100
    if (patch.progress !== undefined && patch.progress >= 100) nextTask.status = 'done'

    const { id, ...taskData } = nextTask

    await updateDoc(doc(db, TASKS_COLLECTION, taskId), {
      ...taskData,
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid ?? user?.email ?? null,
    })
  }

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId))
    setTasks((current) => current.filter((task) => task.id !== taskId))
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
        <Route path="/signin" element={<SignInPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TaskBoardPage
                members={members}
                tasks={tasks}
                metrics={taskMetrics}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                isLoadingTasks={tasksLoading}
                tasksError={tasksError}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MembersPage
                members={members}
                tasks={tasks}
                onAddMember={addMember}
                onUpdateMember={updateMember}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage members={members} />
            </ProtectedRoute>
          }
        />

        <Route path="/use-cases" element={<UseCasesPage />} />
        <Route path="/phase-1-examples" element={<PhaseOneExamplesPage />} />
        <Route path="/hidden" element={<HiddenPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
