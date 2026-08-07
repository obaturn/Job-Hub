export default function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  hint,
  placeholder,
  autoComplete,
  required = true,
  ...props
}) {
  const messageId = `${id}-message`

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        className={`field__input${error ? ' field__input--error' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
        {...props}
      />
      <div id={messageId} className={`field__message${error ? ' field__message--error' : ''}`}>
        {error || hint || '\u00a0'}
      </div>
    </div>
  )
}
