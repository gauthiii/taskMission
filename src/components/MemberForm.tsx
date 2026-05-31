import { useState } from 'react'
import { Plus, UserPlus } from 'lucide-react'

import type { MemberDraft } from '../types'

const colors = ['#2563eb', '#7c3aed', '#16a34a', '#ea580c', '#dc2626', '#0891b2']

type MemberFormProps = {
  onAddMember: (draft: MemberDraft) => void
}

export function MemberForm({ onAddMember }: MemberFormProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [focus, setFocus] = useState('')
  const [color, setColor] = useState(colors[0])

  const submitMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    onAddMember({
      name: name.trim(),
      role: role.trim() || 'Mission Contributor',
      focus: focus.trim() || 'Active task support',
      color,
    })
    setName('')
    setRole('')
    setFocus('')
    setColor(colors[0])
  }

  return (
    <form className="member-form" onSubmit={submitMember}>
      <div className="section-title">
        <span className="eyebrow">Crew intake</span>
        <h2><UserPlus size={20} /> Add member</h2>
      </div>
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        Role
        <input value={role} onChange={(event) => setRole(event.target.value)} />
      </label>
      <label>
        Focus
        <input value={focus} onChange={(event) => setFocus(event.target.value)} />
      </label>
      <div className="swatch-row" aria-label="Member color">
        {colors.map((option) => (
          <button
            key={option}
            type="button"
            className={color === option ? 'active' : ''}
            style={{ background: option }}
            onClick={() => setColor(option)}
            aria-label={`Use ${option}`}
          />
        ))}
      </div>
      <button type="submit" className="submit-button">
        <Plus size={18} />
        Add member
      </button>
    </form>
  )
}
