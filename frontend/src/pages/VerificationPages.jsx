import { useEffect, useState } from 'react'
import { CheckCircle2, Clock3, ExternalLink, MailCheck, RefreshCw, TriangleAlert } from 'lucide-react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import FormAlert from '../components/FormAlert'
import TextField from '../components/TextField'
import { authApi } from '../api/authApi'
import { getApiErrorMessage, getEmailError } from '../auth/authValidation'
import {
  clearPendingVerification,
  getPendingVerification,
  rememberAuthCheckpoint,
  rememberPendingVerification,
} from '../auth/verificationState'
import { getEmailProvider } from '../auth/emailProvider'
import { NAV } from '../app/navigation'

function VerificationCard({ children }) {
  return <div className="center-page"><div className="center-card">{children}</div></div>
}

function getPendingDetails(location) {
  const stored = getPendingVerification()
  const sessionEmail = typeof window !== 'undefined' ? sessionStorage.getItem('jobhub.registeredEmail') : ''
  const sessionFirstName = typeof window !== 'undefined' ? sessionStorage.getItem('jobhub.registeredFirstName') : ''
  const sessionLastName = typeof window !== 'undefined' ? sessionStorage.getItem('jobhub.registeredLastName') : ''
  return {
    email: location.state?.email || stored?.email || sessionEmail || '',
    firstName: location.state?.firstName || stored?.firstName || sessionFirstName || '',
    lastName: location.state?.lastName || stored?.lastName || sessionLastName || '',
  }
}

export function VerificationPendingPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const details = getPendingDetails(location)
  const [email, setEmail] = useState(details.email)
  const [firstName] = useState(details.firstName)
  const [lastName] = useState(details.lastName)
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const emailError = touched ? getEmailError(email) : ''
  const isRecovery = searchParams.get('recovery') === '1' || !details.email
  const provider = getEmailProvider(email)
  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  useEffect(() => {
    if (!cooldown) return undefined
    const timer = window.setInterval(() => setCooldown((current) => Math.max(0, current - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const resend = async (event) => {
    event?.preventDefault()
    setTouched(true)
    const validationError = getEmailError(email)
    if (validationError || cooldown) return
    setStatus('loading')
    setError('')
    try {
      await authApi.resendVerification({ email: email.trim() })
      rememberPendingVerification({ email, firstName, lastName })
      setStatus('success')
      setCooldown(30)
    } catch (requestError) {
      setStatus('idle')
      setError(getApiErrorMessage(requestError, 'We could not send a new verification email. Please try again.'))
    }
  }

  return <AuthLayout authMode="register" progress={{ currentStep: 2, completedSteps: [1], status: 'active' }} eyebrow="One small step" title="Check your email" description={fullName ? `One more step, ${fullName}. Confirm your email to activate your JobHub account.` : 'We sent a verification link to your inbox. Open it to activate your JobHub account.'} visualTitle="Your professional story starts with a signal." visualDescription="Verify your email and take the next confident step toward a profile built around your goals.">
    <VerificationCard>
      <div className="status-icon status-icon--accent"><MailCheck size={28} aria-hidden="true" /></div>
      <h2>{fullName ? `Almost there, ${fullName}.` : 'Almost there'}</h2>
      {isRecovery ? <>
        <p className="verification-recovery-copy">Enter the email address you used to create your JobHub account. We will send a fresh verification link if the account still needs verification.</p>
        <form className="verification-recovery-form" onSubmit={resend} noValidate>
          <TextField id="recoveryEmail" label="Email address" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus('idle'); setError('') }} onBlur={() => setTouched(true)} error={emailError} autoComplete="email" placeholder="you@example.com" />
          <FormAlert type="success">{status === 'success' ? 'A new verification email has been sent. Check your inbox, spam, junk, or Promotions folder.' : ''}</FormAlert>
          <FormAlert>{error}</FormAlert>
          <Button type="submit" className="button--full" loading={status === 'loading'} disabled={Boolean(cooldown)}>{cooldown ? `Resend available in ${cooldown}s` : 'Request a new link'} <RefreshCw size={16} aria-hidden="true" /></Button>
        </form>
      </> : <>
        <p>We sent a JobHub verification link to:</p>
        <strong className="email-highlight">{email}</strong>
        <div className="verification-provider">
          {provider.url ? <a className="button button--secondary button--full verification-provider__link" href={provider.url} target="_blank" rel="noreferrer">Open {provider.label} <ExternalLink size={15} aria-hidden="true" /></a> : <p className="verification-provider__fallback">Open your email app and look for a message from JobHub.</p>}
          <p className="verification-provider__hint">Not in your inbox? Check your spam, junk, or Promotions folder. Search for a message from JobHub.</p>
        </div>
        <div className="verification-note"><Clock3 size={16} aria-hidden="true" /><span>The link is valid for 24 hours and can only be used once.</span></div>
        <FormAlert type="success">{status === 'success' ? 'A new verification email has been sent. Check your inbox, spam, junk, or Promotions folder.' : ''}</FormAlert>
        <FormAlert>{error}</FormAlert>
        <form onSubmit={resend} noValidate>
          <Button type="submit" className="button--full" loading={status === 'loading'} disabled={Boolean(cooldown)}>{cooldown ? `Resend available in ${cooldown}s` : 'Resend verification email'} <RefreshCw size={16} aria-hidden="true" /></Button>
        </form>
      </>}
      <Link className="center-card__link" to={NAV.register}>Use a different email</Link>
      <Link className="center-card__link center-card__link--secondary" to={NAV.login}>Already verified? Sign in</Link>
    </VerificationCard>
  </AuthLayout>
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState(token ? 'loading' : 'invalid')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    if (!token) return undefined
    authApi.verifyEmail({ token }).then(() => {
      if (active) {
        clearPendingVerification()
        rememberAuthCheckpoint('/login')
        setStatus('success')
      }
    }).catch((requestError) => {
      if (active) {
        const apiMessage = getApiErrorMessage(requestError, '')
        const isExpired = /invalid|expired|already used/i.test(apiMessage)
        setStatus('error')
        setError(isExpired ? 'This verification link has expired or has already been used.' : 'We could not verify this link right now. Please try again or request a new link.')
      }
    })
    return () => { active = false }
  }, [token])

  const progressStatus = status === 'success' ? 'completed' : status === 'error' || status === 'invalid' ? 'error' : 'active'
  const isInvalidLink = status === 'error' || status === 'invalid'

  return <AuthLayout authMode="login" progress={{ currentStep: 2, completedSteps: status === 'success' ? [1, 2] : [1], status: progressStatus }} eyebrow="Email verification" title={status === 'success' ? 'Email verified successfully' : status === 'loading' ? 'Verifying your email' : 'Verification link unavailable'} description={status === 'success' ? 'Your JobHub account is ready. Continue to sign in and begin your next chapter.' : status === 'loading' ? 'We are confirming your email address. This will only take a moment.' : 'This verification link can no longer be used. Request a fresh link to verify your email.'}>
    <VerificationCard>
      <div className={`status-icon ${status === 'success' ? 'status-icon--success' : status === 'loading' ? 'status-icon--accent' : 'status-icon--danger'}`}>
        {status === 'success' ? <CheckCircle2 size={28} aria-hidden="true" /> : status === 'loading' ? <RefreshCw className="spin" size={28} aria-hidden="true" /> : <TriangleAlert size={28} aria-hidden="true" />}
      </div>
      {status === 'error' && <FormAlert><span><strong>Verification did not complete.</strong> {error} Enter your email on the next page to receive a new 24-hour verification link.</span></FormAlert>}
      {status === 'invalid' && <FormAlert><span><strong>Verification link unavailable.</strong> Open the link from your verification email or request a new one using your email address.</span></FormAlert>}
      {status === 'success' ? <Link className="button button--primary button--full" to={NAV.login} onClick={() => rememberAuthCheckpoint('/login')}>Continue to sign in <span aria-hidden="true">→</span></Link> : isInvalidLink ? <Link className="button button--secondary button--full" to={`${NAV.verifyPending}?recovery=1`}>Request a new link</Link> : null}
    </VerificationCard>
  </AuthLayout>
}
