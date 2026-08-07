import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getRememberedPath, sanitizeReturnPath } from '../auth/returnPath'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import FormAlert from '../components/FormAlert'
import PasswordField from '../components/PasswordField'
import TextField from '../components/TextField'
import { getApiErrorMessage, getLoginErrors } from '../auth/authValidation'
import { useAuth } from '../auth/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [values, setValues] = useState({ email: '', password: '', rememberMe: false })
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const errors = useMemo(() => getLoginErrors(values), [values])

  const update = (field) => (event) => {
    const nextValue = field === 'rememberMe' ? event.target.checked : event.target.value
    setValues((current) => ({ ...current, [field]: nextValue }))
    setTouched((current) => ({ ...current, [field]: true }))
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setTouched({ email: true, password: true })
    if (Object.keys(errors).length) return
    setStatus('loading')
    try {
      await login(values)
      const stateFrom = location.state?.from
      const statePath = typeof stateFrom === 'string' ? stateFrom : stateFrom?.pathname ? `${stateFrom.pathname}${stateFrom.search || ''}${stateFrom.hash || ''}` : null
      navigate(sanitizeReturnPath(statePath) || getRememberedPath(), { replace: true })
    } catch (requestError) {
      setStatus('idle')
      setError(getApiErrorMessage(requestError, 'We could not sign you in. Check your details and try again.'))
    }
  }

  return <AuthLayout authMode="login" eyebrow="Welcome back" title="Sign in to JobHub" description="Your next opportunity starts with the profile you are building." footer={<span>Don't have an account? <Link to="/register">Create one</Link></span>}>
    <form className="auth-form" onSubmit={submit} noValidate>
      <FormAlert>{error}</FormAlert>
      <TextField id="loginEmail" label="Email address" type="email" value={values.email} onChange={update('email')} error={touched.email && errors.email} autoComplete="email" placeholder="you@example.com" />
      <PasswordField id="loginPassword" label="Password" value={values.password} onChange={update('password')} error={touched.password && errors.password} autoComplete="current-password" />
      <div className="form-options"><label className="checkbox-label"><input type="checkbox" checked={values.rememberMe} onChange={update('rememberMe')} /><span className="checkbox-label__box" aria-hidden="true" />Remember me</label><Link to="/forgot-password">Forgot password?</Link></div>
      <Button type="submit" className="button--full" loading={status === 'loading'}>Sign in <span aria-hidden="true">→</span></Button>
    </form>
  </AuthLayout>
}
