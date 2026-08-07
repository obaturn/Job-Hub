import { Check, Circle, LogOut, Sparkles } from 'lucide-react'
import CareerMark from '../components/site/CareerMark'
import Button from '../components/Button'
import { useAuth } from '../auth/AuthContext'

const steps = [['Basic info', 'Your professional foundations'], ['Experience', 'The work that shaped you'], ['Skills', 'What you bring to the room']]

export default function ProfileSetupPlaceholderPage() {
  const { user, logout } = useAuth()
  const displayName = user?.firstName || user?.email?.split('@')[0] || 'there'

  return <main className="profile-page"><header className="profile-header container"><CareerMark /><Button variant="ghost" onClick={logout}><LogOut size={16} aria-hidden="true" /> Log out</Button></header><div className="container profile-layout"><aside className="profile-steps"><p className="eyebrow">Your next step</p><h1>Build your profile</h1><p>Make your professional identity easier to understand, remember, and trust.</p><div className="profile-step-list">{steps.map(([title, description], index) => <div className={`profile-step${index === 0 ? ' profile-step--active' : ''}`} key={title}><span className="profile-step__icon">{index === 0 ? <Circle size={11} fill="currentColor" aria-hidden="true" /> : <Check size={15} aria-hidden="true" />}</span><span><strong>{title}</strong><small>{description}</small></span></div>)}</div></aside><section className="profile-card"><div className="profile-card__icon"><Sparkles size={22} aria-hidden="true" /></div><p className="eyebrow">Welcome to JobHub</p><h2>Glad you’re here, {displayName}.</h2><p>Your account is ready. We’re excited to help you turn your experience, strengths, and direction into a professional profile you can be proud to share.</p><p className="profile-card__promise">Your next chapter starts with one clear step: make your professional story easier to understand.</p><div className="profile-preview"><div><span className="profile-preview__label">Profile completion</span><strong>Ready to begin</strong></div><div className="profile-preview__bar"><span /></div><div className="profile-preview__steps"><span><Check size={14} aria-hidden="true" /> Account created</span><span><Circle size={13} aria-hidden="true" /> Profile setup next</span></div></div><Button variant="secondary" disabled>Profile setup is coming next</Button></section></div></main>
}
