import { Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { getRememberedPath, rememberProtectedPath } from '../auth/returnPath'
import { NAV } from '../app/navigation'
import { useAuth } from '../auth/AuthContext'
import LoadingScreen from './LoadingScreen'

export function GuestRoute({ children }) {
  const { status } = useAuth()
  if (status === 'unknown') return <LoadingScreen />
  if (status === 'authenticated') return <Navigate to={getRememberedPath() || NAV.profileSetup} replace />
  return children
}

export function ProtectedRoute({ children }) {
  const { status } = useAuth()
  const location = useLocation()
  useEffect(() => {
    if (status !== 'unknown') rememberProtectedPath(location)
  }, [location.hash, location.pathname, location.search, status])
  if (status === 'unknown') return <LoadingScreen />
  if (status !== 'authenticated') {
    return <Navigate to={NAV.login} replace state={{ from: { pathname: location.pathname, search: location.search, hash: location.hash } }} />
  }
  return children
}
