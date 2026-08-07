import { Check, Circle } from 'lucide-react'
import { getPasswordChecks } from '../auth/authValidation'

export default function PasswordChecklist({ password }) {
  const checks = getPasswordChecks(password)
  const items = [
    ['minLength', 'At least 8 characters'],
    ['uppercase', 'One uppercase letter'],
    ['number', 'One number'],
  ]

  return (
    <ul className="password-checklist" aria-label="Password requirements">
      {items.map(([key, label]) => (
        <li key={key} className={checks[key] ? 'is-complete' : ''}>
          {checks[key] ? <Check size={14} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}
