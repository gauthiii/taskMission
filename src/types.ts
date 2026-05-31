export type TaskStatus = 'queued' | 'in-motion' | 'blocked' | 'review' | 'done'

export type Priority = 'low' | 'medium' | 'high' | 'critical'

export type Member = {
  id: string
  name: string
  role: string
  color: string
  focus: string
}

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  startDate: string
  deadline: string
  progress: number
  assigneeIds: string[]
  tags: string[]
}

export type TaskDraft = Omit<Task, 'id'>
export type MemberDraft = Omit<Member, 'id'>

export type MeetingPeriod = 'morning' | 'evening'

export type ProgressEntry = {
  date: string
  memberId: string
  points: string[]
  updatedAt: string
}

export type MeetingEntry = {
  date: string
  period: MeetingPeriod
  happened: boolean
  points: string[]
  updatedAt: string
}
