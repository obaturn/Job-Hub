export default function CareerMark({ light = false, compact = false }) {
  return (
    <span className={`career-mark${light ? ' career-mark--light' : ''}${compact ? ' career-mark--compact' : ''}`}>
      <span className="career-mark__symbol" aria-hidden="true">
        <svg viewBox="0 0 34 34" role="presentation">
          <path d="M5 24.5c5.7-1.2 8.6-5.8 10.2-10.7 1.1-3.4 3.5-5.4 7.2-5.4h5.2" />
          <path d="m22.6 4.9 5 3.5-5 3.5" />
          <path d="M5 28.5h22" className="career-mark__base" />
        </svg>
      </span>
      <span className="career-mark__name">JobHub</span>
    </span>
  )
}
