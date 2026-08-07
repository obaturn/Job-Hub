import { NAV } from '../app/navigation'

const RETURN_PATH_KEY = 'jobhub.lastProtectedPath'

function isSafeProtectedPath(value) {
  return typeof value === 'string' && value.startsWith('/profile/') && !value.startsWith('//')
}

export function sanitizeReturnPath(value) {
  if (!isSafeProtectedPath(value)) return null
  try {
    const url = new URL(value, window.location.origin)
    if (url.origin !== window.location.origin) return null
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}

export function rememberProtectedPath(location) {
  const path = sanitizeReturnPath(`${location.pathname}${location.search || ''}${location.hash || ''}`)
  if (path) window.localStorage.setItem(RETURN_PATH_KEY, path)
}

export function getRememberedPath() {
  return sanitizeReturnPath(window.localStorage.getItem(RETURN_PATH_KEY)) || NAV.profileSetup
}

export function clearRememberedPath() {
  window.localStorage.removeItem(RETURN_PATH_KEY)
}
