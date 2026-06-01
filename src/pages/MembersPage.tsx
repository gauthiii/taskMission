import { useState } from 'react'
import { Award, BriefcaseBusiness, Check, CheckCircle2, Edit3, Flame, UserRoundCheck, UsersRound, X } from 'lucide-react'

import { MemberForm } from '../components/MemberForm'
import type { Member, MemberDraft, Task } from '../types'

type MembersPageProps = {
  members: Member[]
  tasks: Task[]
  onAddMember: (draft: MemberDraft) => void
  onUpdateMember: (memberId: string, patch: Partial<Member>) => void
}

function getMemberStats(memberId: string, tasks: Task[]) {
  const assigned = tasks.filter((task) => task.assigneeIds.includes(memberId))
  const active = assigned.filter((task) => task.status !== 'done')
  const completed = assigned.filter((task) => task.status === 'done')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdue = active.filter((task) => new Date(task.deadline) < today).length
  const workload = active.reduce((sum, task) => sum + (100 - task.progress), 0)

  return { assigned, active, completed, overdue, workload }
}

export function MembersPage({ members, tasks, onAddMember, onUpdateMember }: MembersPageProps) {
  const spotlight = members[0]
  const spotlightStats = spotlight ? getMemberStats(spotlight.id, tasks) : null
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [memberDraft, setMemberDraft] = useState<MemberDraft>({
    name: '',
    role: 'AI/SN Developer',
    color: '#2563eb',
    focus: '',
  })

  const startEditing = (member: Member) => {
    setEditingMemberId(member.id)
    setMemberDraft({
      name: member.name,
      role: member.role,
      color: member.color,
      focus: member.focus,
    })
  }

  const cancelEditing = () => {
    setEditingMemberId(null)
  }

  const saveEditing = (memberId: string) => {
    if (!memberDraft.name.trim()) return
    onUpdateMember(memberId, {
      name: memberDraft.name.trim(),
      role: memberDraft.role.trim() || 'AI/SN Developer',
      focus: memberDraft.focus.trim() || 'Active AI/SN delivery',
      color: memberDraft.color,
    })
    setEditingMemberId(null)
  }

  return (
    <main className="page-shell members-page">
      <section className="hero-band member-hero">
        <div>
          <span className="eyebrow">Team roster</span>
          <h1>See who owns what, where workload is heating up, and who just closed the loop.</h1>
          <p>Members added here live for the current session, matching the mock-data behavior of the board.</p>
        </div>
        <div className="crew-badge">
          <UsersRound size={24} />
          <strong>{members.length}</strong>
          <span>active members</span>
        </div>
      </section>

      <section className="members-layout">
        <div className="member-gallery">
          {members.map((member) => {
            const stats = getMemberStats(member.id, tasks)
            const isEditing = editingMemberId === member.id
            return (
              <article key={member.id} className="member-card">
                <div className="member-card-top">
                  <span className="member-avatar" style={{ background: member.color }}>
                    {member.name.slice(0, 1)}
                  </span>
                  <div className="member-heading">
                    {isEditing ? (
                      <>
                        <input
                          value={memberDraft.name}
                          onChange={(event) => setMemberDraft((draft) => ({ ...draft, name: event.target.value }))}
                          aria-label="Member name"
                        />
                        <input
                          value={memberDraft.role}
                          onChange={(event) => setMemberDraft((draft) => ({ ...draft, role: event.target.value }))}
                          aria-label="Member role"
                        />
                      </>
                    ) : (
                      <>
                        <h2>{member.name}</h2>
                        <p>{member.role}</p>
                      </>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <div className="member-edit-panel">
                    <label>
                      Focus
                      <input
                        value={memberDraft.focus}
                        onChange={(event) => setMemberDraft((draft) => ({ ...draft, focus: event.target.value }))}
                      />
                    </label>
                    <label>
                      Color
                      <input
                        type="color"
                        value={memberDraft.color}
                        onChange={(event) => setMemberDraft((draft) => ({ ...draft, color: event.target.value }))}
                      />
                    </label>
                  </div>
                ) : (
                  <p className="member-focus">{member.focus}</p>
                )}
                <div className="member-stats">
                  <span><BriefcaseBusiness size={15} /> {stats.active.length} active</span>
                  <span><CheckCircle2 size={15} /> {stats.completed.length} done</span>
                  <span><Flame size={15} /> {stats.overdue} overdue</span>
                </div>
                <div className="workload-meter">
                  <span style={{ width: `${Math.min(100, stats.workload / 5)}%`, background: member.color }} />
                </div>
                <div className="member-card-actions">
                  {isEditing ? (
                    <>
                      <button type="button" onClick={() => saveEditing(member.id)}>
                        <Check size={15} />
                        Save
                      </button>
                      <button type="button" onClick={cancelEditing}>
                        <X size={15} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => startEditing(member)}>
                      <Edit3 size={15} />
                      Edit
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <aside className="member-side">
          <MemberForm onAddMember={onAddMember} />

          {/* {spotlight && spotlightStats && (
            <section className="spotlight-panel">
              <div className="section-title">
                <span className="eyebrow">Spotlight</span>
                <h2><Award size={20} /> {spotlight.name}</h2>
              </div>
              <div className="spotlight-list">
                {spotlightStats.assigned.map((task) => (
                  <div key={task.id}>
                    <UserRoundCheck size={16} />
                    <span>
                      <strong>{task.title}</strong>
                      <small>{task.progress}% · {task.status.replace('-', ' ')}</small>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )} */}
        </aside>
      </section>
    </main>
  )
}
