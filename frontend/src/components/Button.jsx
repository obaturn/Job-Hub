import { LoaderCircle } from 'lucide-react'

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle className="button__spinner" size={17} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  )
}
