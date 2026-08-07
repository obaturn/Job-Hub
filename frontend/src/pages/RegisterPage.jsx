import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NAV } from '../app/navigation'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import FormAlert from '../components/FormAlert'
import PasswordChecklist from '../components/PasswordChecklist'
import PasswordField from '../components/PasswordField'
import TextField from '../components/TextField'
import { getApiErrorMessage, getRegisterErrors } from '../auth/authValidation'
import { rememberPendingVerification } from '../auth/verificationState'
import { useAuth } from '../auth/AuthContext'

const initialValues = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const errors = useMemo(() => getRegisterErrors(values), [values])

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    setTouched((current) => ({ ...current, [field]: true }))
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true })
    if (Object.keys(errors).length) return
    setStatus('loading')
    try {
      await register({ firstName: values.firstName.trim(), lastName: values.lastName.trim(), email: values.email.trim(), password: values.password })
      const email = values.email.trim()
      const firstName = values.firstName.trim()
      const lastName = values.lastName.trim()
      sessionStorage.setItem('jobhub.registeredEmail', email)
      sessionStorage.setItem('jobhub.registeredFirstName', firstName)
      sessionStorage.setItem('jobhub.registeredLastName', lastName)
      rememberPendingVerification({ email, firstName, lastName })
      navigate(NAV.verifyPending, { state: { email, firstName, lastName } })
    } catch (requestError) {
      setStatus('idle')
      setError(getApiErrorMessage(requestError, 'We could not create your account. Please try again.'))
    }
  }

  return <AuthLayout authMode="register" progress={{ currentStep: 1, status: 'active' }} eyebrow="Start with JobHub" title="Create your account" description="Build the foundation for a professional story that keeps moving forward." footer={<span>Already have an account? <Link to="/login">Sign in</Link></span>}>
    <form className="auth-form" onSubmit={submit} noValidate>
      <FormAlert>{error}</FormAlert>
      <div className="form-grid form-grid--two">
        <TextField id="firstName" label="First name" value={values.firstName} onChange={update('firstName')} error={touched.firstName && errors.firstName} autoComplete="given-name" placeholder="e.g. Amara" />
        <TextField id="lastName" label="Last name" value={values.lastName} onChange={update('lastName')} error={touched.lastName && errors.lastName} autoComplete="family-name" placeholder="e.g. Okafor" />
      </div>
      <TextField id="registerEmail" label="Email address" type="email" value={values.email} onChange={update('email')} error={touched.email && errors.email} autoComplete="email" placeholder="you@example.com" />
      <div><PasswordField id="registerPassword" label="Password" value={values.password} onChange={update('password')} error={touched.password && errors.password} autoComplete="new-password" /><PasswordChecklist password={values.password} /></div>
      <PasswordField id="confirmPassword" label="Confirm password" value={values.confirmPassword} onChange={update('confirmPassword')} error={touched.confirmPassword && errors.confirmPassword} autoComplete="new-password" placeholder="Re-enter your password" />
      <Button type="submit" className="button--full" loading={status === 'loading'}>Create account <span aria-hidden="true">→</span></Button>
    </form>
  </AuthLayout>
}
