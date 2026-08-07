import { Link } from 'react-router-dom'
import { NAV } from '../app/navigation'
import AuthProgressRail from './auth/AuthProgressRail'
import CareerIllustration from './auth/CareerIllustration'
import AuthTopbar from './auth/AuthTopbar'
import CareerMark from './site/CareerMark'

export default function AuthLayout({
  authMode = 'login',
  eyebrow,
  title,
  description,
  children,
  footer,
  progress,
  visualTitle = 'Build your professional story. Grow with direction.',
  visualDescription = 'JobHub brings your professional identity, opportunities, and next move into one trusted place.',
}) {
  return <main className="auth-page"><aside className="auth-value-panel"><Link to={NAV.home} className="auth-value-panel__brand" aria-label="JobHub home"><CareerMark light /></Link><div className="auth-value-panel__copy"><p className="eyebrow eyebrow--light">Your next chapter starts here</p><h2>{visualTitle}</h2><p>{visualDescription}</p></div><CareerIllustration /></aside><section className="auth-form-pane"><AuthTopbar authMode={authMode} /><div className={`auth-form-pane__body${progress ? ' auth-form-pane__body--with-progress' : ''}`}>{progress && <AuthProgressRail {...progress} />}<div className="auth-form-area"><div className="auth-form-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{children}{footer && <div className="auth-form-footer">{footer}</div>}</div></div><p className="auth-legal">By continuing, you agree to JobHub's Terms and Privacy Policy.</p></section></main>
}
