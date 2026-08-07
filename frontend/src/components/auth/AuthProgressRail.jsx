import { Check, CircleUserRound, MailCheck, TriangleAlert } from 'lucide-react'

const defaultSteps = [
  { id: 1, eyebrow: 'STEP 1', label: 'Provide basic details', icon: CircleUserRound },
  { id: 2, eyebrow: 'STEP 2', label: 'Verify email address', icon: MailCheck },
]

export default function AuthProgressRail({
  currentStep = 1,
  completedSteps = [],
  status = 'active',
  steps = defaultSteps,
}) {
  return <aside className="auth-progress" aria-label="Account setup progress"><div className="auth-progress__heading"><h2>Get started</h2><p>Set up your account</p></div><ol className="auth-progress__list">{steps.map((step) => {
    const isCompleted = completedSteps.includes(step.id)
    const isActive = currentStep === step.id && !isCompleted
    const stepStatus = currentStep === step.id ? status : isCompleted ? 'completed' : 'pending'
    const Icon = stepStatus === 'completed' ? Check : stepStatus === 'error' ? TriangleAlert : step.icon
    return <li className={`auth-progress__step auth-progress__step--${stepStatus}`} key={step.id} aria-current={isActive ? 'step' : undefined}><span className="auth-progress__marker"><Icon size={17} strokeWidth={2} aria-hidden="true" /></span><span className="auth-progress__copy"><span className="auth-progress__eyebrow">{step.eyebrow}</span><strong>{step.label}</strong><span className="sr-only">{stepStatus}</span></span></li>
  })}</ol></aside>
}
