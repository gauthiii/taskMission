import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type Props = {
  children: React.ReactElement
}

export function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/signin" replace />
  return children
}

export default ProtectedRoute
