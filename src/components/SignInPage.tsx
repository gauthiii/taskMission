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
      <section className="signin-box">
        <h1>Sign in to TaskMission</h1>
        <p>Sign in with your Google account to access the team mission board.</p>
        <button onClick={handleSignIn} disabled={loading} className="btn btn-primary">
          {loading ? 'Signing in…' : 'Sign in with Google'}
        </button>
        {error ? <p className="error">{error.message}</p> : null}
      </section>
    </main>
  )
}

export default SignInPage
