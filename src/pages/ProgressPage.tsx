import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { CalendarDays, Check, ClipboardList, Eraser, Moon, Pencil, Save, Sun, X } from 'lucide-react'

import type { MeetingEntry, MeetingPeriod, Member, ProgressEntry } from '../types'

const STORAGE_KEY = 'taskmission.progress.v1'
const START_DATE = '2026-06-01'
const END_DATE = '2026-07-01'

type ProgressState = {
  progressEntries: ProgressEntry[]
  meetingEntries: MeetingEntry[]
}

type ProgressPageProps = {
  members: Member[]
}

type EditablePointsProps = {
  points: string[]
  placeholder: string
  accentColor?: string
  onSave: (points: string[]) => void
}

type MeetingCellProps = {
  entry?: MeetingEntry
  period: MeetingPeriod
  onChange: (patch: Pick<MeetingEntry, 'happened' | 'points'>) => void
}

const createDateRange = () => {
  const dates: string[] = []
  const cursor = new Date(`${START_DATE}T00:00:00`)
  const end = new Date(`${END_DATE}T00:00:00`)

  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

const normalizePoints = (raw: string) =>
  raw
    .split(/\n+/)
    .flatMap((line) => line.split(/[.;,]+/))
    .map((part) => part.trim().replace(/^[\-*•]\s*/, '').replace(/[.;,]+$/g, '').trim())
    .filter(Boolean)

const pointsToDraft = (points: string[]) => points.join('\n')

const getInitialProgressState = (): ProgressState => {
  if (typeof window === 'undefined') return { progressEntries: [], meetingEntries: [] }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return { progressEntries: [], meetingEntries: [] }
    const parsed = JSON.parse(stored) as Partial<ProgressState>

    return {
      progressEntries: Array.isArray(parsed.progressEntries) ? parsed.progressEntries : [],
      meetingEntries: Array.isArray(parsed.meetingEntries) ? parsed.meetingEntries : [],
    }
  } catch {
    return { progressEntries: [], meetingEntries: [] }
  }
}

function EditablePoints({ points, placeholder, accentColor = '#2563eb', onSave }: EditablePointsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(pointsToDraft(points))

  useEffect(() => {
    if (!isEditing) setDraft(pointsToDraft(points))
  }, [isEditing, points])

  const commit = () => {
    onSave(normalizePoints(draft))
    setIsEditing(false)
  }

  const cancel = () => {
    setDraft(pointsToDraft(points))
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="progress-editor" style={{ '--entry-color': accentColor } as CSSProperties}>
        <textarea
          value={draft}
          autoFocus
          placeholder={placeholder}
          onBlur={commit}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              commit()
            }
            if (event.key === 'Escape') {
              event.preventDefault()
              cancel()
            }
          }}
        />
        <div className="progress-cell-actions">
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={commit}>
            <Save size={13} /> Save
          </button>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={cancel}>
            <X size={13} /> Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={points.length ? 'progress-read-cell has-points' : 'progress-read-cell'}
      style={{ '--entry-color': accentColor } as CSSProperties}
      onClick={() => setIsEditing(true)}
    >
      {points.length ? (
        <>
          <ul>
            {points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <span><Pencil size={13} /> Edit</span>
        </>
      ) : (
        <span className="empty-progress"><Pencil size={13} /> {placeholder}</span>
      )}
    </button>
  )
}

function MeetingCell({ entry, period, onChange }: MeetingCellProps) {
  const happened = entry?.happened ?? false
  const points = entry?.points ?? []
  const title = period === 'morning' ? 'Morning Meeting' : 'Evening Meeting'

  return (
    <div className={`meeting-cell ${happened ? 'meeting-yes' : ''}`}>
      <div className="meeting-toggle-row">
        <button
          type="button"
          className={happened ? 'active' : ''}
          onClick={() => onChange({ happened: !happened, points })}
        >
          {happened ? <Check size={14} /> : <X size={14} />}
          {happened ? 'Yes' : 'No'}
        </button>
        {points.length > 0 && (
          <button type="button" className="clear-mini" onClick={() => onChange({ happened, points: [] })}>
            <Eraser size={13} />
          </button>
        )}
      </div>
      {happened ? (
        <EditablePoints
          points={points}
          placeholder={`Add ${title.toLowerCase()} notes`}
          accentColor={period === 'morning' ? '#d97706' : '#7c3aed'}
          onSave={(nextPoints) => onChange({ happened, points: nextPoints })}
        />
      ) : (
        <div className="meeting-off">Meeting not marked</div>
      )}
    </div>
  )
}

export function ProgressPage({ members }: ProgressPageProps) {
  const dates = useMemo(createDateRange, [])
  const [progressState, setProgressState] = useState<ProgressState>(getInitialProgressState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState))
  }, [progressState])

  const progressByKey = useMemo(() => {
    const map = new Map<string, ProgressEntry>()
    progressState.progressEntries.forEach((entry) => map.set(`${entry.date}:${entry.memberId}`, entry))
    return map
  }, [progressState.progressEntries])

  const meetingsByKey = useMemo(() => {
    const map = new Map<string, MeetingEntry>()
    progressState.meetingEntries.forEach((entry) => map.set(`${entry.date}:${entry.period}`, entry))
    return map
  }, [progressState.meetingEntries])

  const saveProgressEntry = (date: string, memberId: string, points: string[]) => {
    setProgressState((current) => {
      const withoutEntry = current.progressEntries.filter(
        (entry) => !(entry.date === date && entry.memberId === memberId),
      )
      if (!points.length) return { ...current, progressEntries: withoutEntry }

      return {
        ...current,
        progressEntries: [
          ...withoutEntry,
          { date, memberId, points, updatedAt: new Date().toISOString() },
        ],
      }
    })
  }

  const saveMeetingEntry = (
    date: string,
    period: MeetingPeriod,
    patch: Pick<MeetingEntry, 'happened' | 'points'>,
  ) => {
    setProgressState((current) => {
      const withoutEntry = current.meetingEntries.filter(
        (entry) => !(entry.date === date && entry.period === period),
      )
      if (!patch.happened && !patch.points.length) return { ...current, meetingEntries: withoutEntry }

      return {
        ...current,
        meetingEntries: [
          ...withoutEntry,
          { date, period, happened: patch.happened, points: patch.points, updatedAt: new Date().toISOString() },
        ],
      }
    })
  }

  const filledProgressCount = progressState.progressEntries.filter((entry) => entry.points.length > 0).length
  const happenedMeetingCount = progressState.meetingEntries.filter((entry) => entry.happened).length

  return (
    <main className="page-shell progress-page">
      <section className="progress-hero">
        <div>
          <span className="eyebrow">Daily logbook</span>
          <h1>Progress tracking from June 1 to July 1, 2026.</h1>
          <p>Capture each member's daily updates plus morning and evening meeting notes in one dated operating grid.</p>
        </div>
        <div className="progress-overview" aria-label="Progress overview">
          <span><CalendarDays size={18} /><strong>{dates.length}</strong> days</span>
          <span><ClipboardList size={18} /><strong>{filledProgressCount}</strong> updates</span>
          <span><Check size={18} /><strong>{happenedMeetingCount}</strong> meetings</span>
        </div>
      </section>

      <section className="progress-log-shell">
        <div className="progress-table-wrap">
          <table className="progress-table">
            <thead>
              <tr>
                <th className="progress-date-col">Date</th>
                {members.map((member) => (
                  <th key={member.id} className="member-progress-head">
                    <span style={{ background: member.color }}>{member.name.slice(0, 1)}</span>
                    <strong>{member.name}</strong>
                  </th>
                ))}
                <th className="meeting-head"><Sun size={16} /> Morning Meeting</th>
                <th className="meeting-head"><Moon size={16} /> Evening Meeting</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((date) => (
                <tr key={date}>
                  <th className="progress-date-col">
                    <strong>{formatDate(date)}</strong>
                    <span>{date}</span>
                  </th>
                  {members.map((member) => {
                    const entry = progressByKey.get(`${date}:${member.id}`)
                    return (
                      <td key={member.id}>
                        <EditablePoints
                          points={entry?.points ?? []}
                          placeholder="Add update"
                          accentColor={member.color}
                          onSave={(points) => saveProgressEntry(date, member.id, points)}
                        />
                      </td>
                    )
                  })}
                  <td className="meeting-progress-cell">
                    <MeetingCell
                      period="morning"
                      entry={meetingsByKey.get(`${date}:morning`)}
                      onChange={(patch) => saveMeetingEntry(date, 'morning', patch)}
                    />
                  </td>
                  <td className="meeting-progress-cell">
                    <MeetingCell
                      period="evening"
                      entry={meetingsByKey.get(`${date}:evening`)}
                      onChange={(patch) => saveMeetingEntry(date, 'evening', patch)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
