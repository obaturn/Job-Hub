import { LoaderCircle } from 'lucide-react'

export default function LoadingScreen({ label = 'Loading JobHub' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <LoaderCircle className="loading-screen__icon" size={28} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
