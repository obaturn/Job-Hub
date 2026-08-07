import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function FormAlert({ type = 'error', children }) {
  if (!children) return null
  const isSuccess = type === 'success'
  return (
    <div className={`form-alert form-alert--${type}`} role={isSuccess ? 'status' : 'alert'}>
      {isSuccess ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
      <span>{children}</span>
    </div>
  )
}
