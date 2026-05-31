import { BookOpenCheck, CheckCircle2, FileText, LayoutDashboard, NotebookTabs, ShieldCheck, UsersRound, User, LogOut } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type AppNavProps = {
  metrics: {
    total: number
    completed: number
    atRisk: number
    overdue: number
    averageProgress: number
  }
}

export function AppNav({ metrics }: AppNavProps) {
  const location = useLocation()
  const isKnowledgePage = location.pathname === '/use-cases' || location.pathname === '/phase-1-examples'
  const { user, signOut } = useAuth()
  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : '')
  const initials = displayName
    ? displayName
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <header className="app-nav">
      <NavLink to="/" className="brand-mark" aria-label="TaskMission home">
        <span className="brand-icon">
          <ShieldCheck size={22} />
        </span>
        <span>
          <strong>TaskMission</strong>
          <small>Team progress command deck</small>
        </span>
      </NavLink>

      <nav className="nav-tabs" aria-label="Primary navigation">
        <NavLink to="/" end>
          <LayoutDashboard size={17} />
          Board
        </NavLink>
        <NavLink to="/members">
          <UsersRound size={17} />
          Members
        </NavLink>
        <NavLink to="/progress">
          <NotebookTabs size={17} />
          Progress
        </NavLink>
        <NavLink to="/use-cases">
          <BookOpenCheck size={17} />
          Use Cases
        </NavLink>
        <NavLink to="/phase-1-examples">
          <FileText size={17} />
          Phase 1 Examples
        </NavLink>
      </nav>

      <div className="nav-pulse" aria-label="Mission completion">
        {isKnowledgePage ? (
          <>
            <BookOpenCheck size={16} />
            <span>Knowledge base</span>
            <b>Read-only</b>
          </>
        ) : (
          <>
            <CheckCircle2 size={16} />
            <span>{metrics.completed}/{metrics.total} complete</span>
            <b>{metrics.averageProgress}%</b>
          </>
        )}
      </div>

      <div className="nav-user">
        {user ? (
          <div className="user-block">
            <div className="user-avatar" aria-hidden>
              {user.photoURL ? <img src={user.photoURL} alt="avatar" /> : <span>{initials}</span>}
            </div>
            <div className="user-meta">
              <div className="greeting">Hi, <strong>{displayName}</strong></div>
              <div className="user-email muted">{user.email}</div>
            </div>
            <button className="signout-btn" onClick={() => signOut()} aria-label="Sign out">
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        ) : (
          <NavLink to="/signin" className="btn btn-link">
            Sign in
          </NavLink>
        )}
      </div>
    </header>
  )
}
