import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import FormAlert from '../components/FormAlert'
import PasswordChecklist from '../components/PasswordChecklist'
import PasswordField from '../components/PasswordField'
import TextField from '../components/TextField'
import { authApi } from '../api/authApi'
import { getApiErrorMessage, getForgotPasswordErrors, getResetPasswordErrors } from '../auth/authValidation'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const errors = useMemo(() => getForgotPasswordErrors({ email }), [email])

  const submit = async (event) => {
    event.preventDefault()
    setTouched(true)
    if (errors.email) return
    setStatus('loading')
    try {
      await authApi.forgotPassword({ email: email.trim() })
      setStatus('success')
    } catch (requestError) {
      setStatus('idle')
      setError(getApiErrorMessage(requestError, 'We could not process that request. Please try again.'))
    }
  }

  return <AuthLayout authMode="login" eyebrow="Account recovery" title="Forgot your password?" description="Enter your email and we will share the next step with you." footer={<span>Remember your password? <Link to="/login">Back to sign in</Link></span>}>
    <form className="auth-form" onSubmit={submit} noValidate>
      {status === 'success' ? <FormAlert type="success">If an account exists for this email, reset instructions have been sent.</FormAlert> : <FormAlert>{error}</FormAlert>}
      <TextField id="forgotEmail" label="Email address" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} onBlur={() => setTouched(true)} error={touched && errors.email} autoComplete="email" placeholder="you@example.com" />
      <Button type="submit" className="button--full" loading={status === 'loading'}>Send reset link <span aria-hidden="true">→</span></Button>
    </form>
  </AuthLayout>
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [values, setValues] = useState({ newPassword: '', confirmPassword: '' })
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState(token ? 'idle' : 'error')
  const [error, setError] = useState(token ? '' : 'This reset link is missing a token.')
  const errors = useMemo(() => getResetPasswordErrors(values), [values])

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    setTouched((current) => ({ ...current, [field]: true }))
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setTouched({ newPassword: true, confirmPassword: true })
    if (Object.keys(errors).length || !token) return
    setStatus('loading')
    try {
      await authApi.resetPassword({ token, newPassword: values.newPassword })
      setStatus('success')
    } catch (requestError) {
      setStatus('error')
      setError(getApiErrorMessage(requestError, 'This reset link may have expired. Request a new one to continue.'))
    }
  }

  return <AuthLayout authMode="login" eyebrow="New credentials" title={status === 'success' ? 'Password reset complete' : 'Create a new password'} description={status === 'success' ? 'Your password has been updated successfully. You can now sign in securely.' : 'Choose a strong password you will remember for your next sign in.'} footer={<span>Remember your password? <Link to="/login">Back to sign in</Link></span>}>
    {status === 'success' ? <div className="success-panel"><FormAlert type="success">Your password has been reset successfully.</FormAlert><Link className="button button--primary button--full" to="/login">Continue to login <span aria-hidden="true">→</span></Link></div> : <form className="auth-form" onSubmit={submit} noValidate><FormAlert>{error}</FormAlert><div><PasswordField id="newPassword" label="New password" value={values.newPassword} onChange={update('newPassword')} error={touched.newPassword && errors.newPassword} autoComplete="new-password" /><PasswordChecklist password={values.newPassword} /></div><PasswordField id="confirmNewPassword" label="Confirm new password" value={values.confirmPassword} onChange={update('confirmPassword')} error={touched.confirmPassword && errors.confirmPassword} autoComplete="new-password" placeholder="Re-enter your password" /><Button type="submit" className="button--full" loading={status === 'loading'}>Reset password <span aria-hidden="true">→</span></Button></form>}
  </AuthLayout>
}
