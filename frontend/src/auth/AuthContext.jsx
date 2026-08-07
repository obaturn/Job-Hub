import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { clearRememberedPath } from './returnPath'
import { clearAuthCheckpoint, clearPendingVerification } from './verificationState'
import { authApi } from '../api/authApi'
import { setAuthSessionHandlers } from '../api/httpClient'

const AuthContext = createContext(null)

function mapUser(data) {
  if (!data?.userId && !data?.email) return null
  return {
    id: data.userId,
    email: data.email,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
  }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('unknown')
  const hasBootstrapped = useRef(false)

  const clearSession = useCallback(() => {
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
    setStatus('anonymous')
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const { data } = await authApi.refreshToken(refreshToken ? { refreshToken } : undefined)
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken || null)
      setUser(mapUser(data))
      setStatus('authenticated')
      return true
    } catch {
      clearSession()
      return false
    }
  }, [clearSession, refreshToken])

  const login = useCallback(async (payload) => {
    const { data } = await authApi.login(payload)
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken || null)
    setUser(mapUser(data))
    clearPendingVerification()
    clearAuthCheckpoint()
    setStatus('authenticated')
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout(refreshToken ? { refreshToken } : undefined)
    } finally {
      clearRememberedPath()
      clearPendingVerification()
      clearAuthCheckpoint()
      clearSession()
    }
  }, [clearSession, refreshToken])

  useEffect(() => {
    setAuthSessionHandlers({
      getAccessToken: () => accessToken,
      refreshSession,
    })
  }, [accessToken, refreshSession])

  useEffect(() => {
    if (hasBootstrapped.current) return undefined
    hasBootstrapped.current = true
    let active = true
    refreshSession().finally(() => {
      if (active) setStatus((currentStatus) => currentStatus === 'authenticated' ? currentStatus : 'anonymous')
    })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => ({
    accessToken,
    user,
    status,
    isAuthenticated: status === 'authenticated',
    login,
    register,
    logout,
    refreshSession,
  }), [accessToken, user, status, login, register, logout, refreshSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
