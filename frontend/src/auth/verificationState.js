const PENDING_VERIFICATION_KEY = 'jobhub.pendingVerification'
const AUTH_CHECKPOINT_KEY = 'jobhub.authCheckpoint'

function canUseStorage() {
  return typeof window !== 'undefined' && window.localStorage
}

function normalizePendingState(value) {
  if (!value || typeof value !== 'object') return null
  const email = typeof value.email === 'string' ? value.email.trim().toLowerCase() : ''
  if (!email) return null
  return {
    email,
    firstName: typeof value.firstName === 'string' ? value.firstName.trim() : '',
    lastName: typeof value.lastName === 'string' ? value.lastName.trim() : '',
  }
}

export function rememberPendingVerification(value) {
  if (!canUseStorage()) return
  const pending = normalizePendingState(value)
  if (pending) window.localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(pending))
}

export function getPendingVerification() {
  if (!canUseStorage()) return null
  try {
    return normalizePendingState(JSON.parse(window.localStorage.getItem(PENDING_VERIFICATION_KEY) || 'null'))
  } catch {
    return null
  }
}

export function clearPendingVerification() {
  if (canUseStorage()) window.localStorage.removeItem(PENDING_VERIFICATION_KEY)
}

export function rememberAuthCheckpoint(path) {
  if (canUseStorage() && path === '/login') window.localStorage.setItem(AUTH_CHECKPOINT_KEY, path)
}

export function getAuthCheckpoint() {
  if (!canUseStorage()) return null
  return window.localStorage.getItem(AUTH_CHECKPOINT_KEY) === '/login' ? '/login' : null
}

export function clearAuthCheckpoint() {
  if (canUseStorage()) window.localStorage.removeItem(AUTH_CHECKPOINT_KEY)
}
