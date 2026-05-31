import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function SignInPage() {
  const { signInWithGoogle, loading, error, user } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
      navigate('/', { replace: true })
    } catch (e) {
      // error is handled by context
    }
  }

  return (
    <main className="signin-page">
      <div className="signin-card">
        <header className="signin-brand">
          <div className="signin-logo">TM</div>
          <div>
            <h1>TaskMission</h1>
            <p className="muted">Team progress command deck</p>
          </div>
        </header>

        <section className="signin-body">
          <h2>Welcome back</h2>
          <p className="muted">Sign in with your Google account to continue to TaskMission.</p>

          <button
            className="google-btn"
            onClick={handleSignIn}
            disabled={loading}
            aria-label="Sign in with Google"
          >
            <span className="google-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.9 0 6.7 1.7 8.2 3.1l6-6C34.6 3.2 29.7 1 24 1 14.7 1 6.9 5.7 3.1 13.3l7.4 5.7C12.9 14 18 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v8h12.7c-.5 3-2.5 6-6.7 8.4l7.8 6c4.6-4.3 7.7-10.5 7.7-18.4z"/>
                <path fill="#4A90E2" d="M10.5 29.1c-1.3-3.9-1.3-8 .1-11.9L3.1 11.5C.9 15.7 0 20.7 0 24.5c0 3.9.9 8.8 3.1 13l7.4-5.4z"/>
                <path fill="#FBBC05" d="M24 46.5c6.1 0 11.2-2 14.9-5.4l-7.8-6c-2.2 1.5-5 2.5-7.1 2.5-5.9 0-10.9-4.5-12.5-10.6l-7.4 5.7C6.9 42.3 14.7 46.5 24 46.5z"/>
              </svg>
            </span>
            <span className="google-label">{loading ? 'Signing in…' : 'Sign in with Google'}</span>
          </button>

          {error ? <p className="error">{error.message}</p> : null}
        </section>

        <footer className="signin-foot muted">By signing in you agree to the team terms.</footer>
      </div>
    </main>
  )
}

export default SignInPage
