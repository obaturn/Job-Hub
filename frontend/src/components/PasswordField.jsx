import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  autoComplete,
  placeholder = 'Enter your password',
}) {
  const [visible, setVisible] = useState(false)
  const messageId = `${id}-message`

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}<span aria-hidden="true">*</span>
      </label>
      <div className={`field__input-wrap${error ? ' field__input-wrap--error' : ''}`}>
        <LockKeyhole className="field__leading-icon" size={17} aria-hidden="true" />
        <input
          id={id}
          className="field__input field__input--password"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
        />
        <button
          type="button"
          className="field__icon-button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
        </button>
      </div>
      <div id={messageId} className={`field__message${error ? ' field__message--error' : ''}`}>
        {error || hint || '\u00a0'}
      </div>
    </div>
  )
}
