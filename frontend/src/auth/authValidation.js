const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function getEmailError(email = '') {
  const normalizedEmail = email.trim()
  if (!normalizedEmail) return 'Email is required'
  if (!emailPattern.test(normalizedEmail)) return 'Enter a valid email address'
  return ''
}

export const getPasswordChecks = (password = '') => ({
  minLength: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /\d/.test(password),
})

export function getPasswordError(password = '') {
  const checks = getPasswordChecks(password)
  if (!password) return 'Password is required'
  if (!checks.minLength) return 'Password must be at least 8 characters'
  if (!checks.uppercase || !checks.number) return 'Use at least one uppercase letter and one number'
  return ''
}

export function getRegisterErrors(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'First name is required'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required'
  if (!values.email.trim()) errors.email = 'Email is required'
  else if (!emailPattern.test(values.email.trim())) errors.email = 'Enter a valid email address'
  const passwordError = getPasswordError(values.password)
  if (passwordError) errors.password = passwordError
  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password'
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return errors
}

export function getLoginErrors(values) {
  const errors = {}
  if (!values.email.trim()) errors.email = 'Email is required'
  else if (!emailPattern.test(values.email.trim())) errors.email = 'Enter a valid email address'
  if (!values.password) errors.password = 'Password is required'
  return errors
}

export function getForgotPasswordErrors(values) {
  const errors = {}
  if (!values.email.trim()) errors.email = 'Email is required'
  else if (!emailPattern.test(values.email.trim())) errors.email = 'Enter a valid email address'
  return errors
}

export function getResetPasswordErrors(values) {
  const errors = {}
  const passwordError = getPasswordError(values.newPassword)
  if (passwordError) errors.newPassword = passwordError
  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password'
  else if (values.newPassword !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return errors
}

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || error?.message || fallback
}
