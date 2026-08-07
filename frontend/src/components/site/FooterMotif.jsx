import { motion, useReducedMotion } from 'motion/react'

const motifPath = 'M0 171H295c24 0 35-12 45-34l24-52c8-18 19-27 43-27h793'

export default function FooterMotif() {
  const shouldReduceMotion = useReducedMotion()
  return <svg className="footer-motif" viewBox="0 0 1200 230" preserveAspectRatio="none" aria-hidden="true"><path className="footer-motif__base" d={motifPath} /><motion.path className="footer-motif__active" d={motifPath} initial={{ pathLength: shouldReduceMotion ? 1 : 0.08, opacity: shouldReduceMotion ? 0.28 : 0.12 }} animate={shouldReduceMotion ? { pathLength: 1, opacity: 0.28 } : { pathLength: [0.08, 1, 0.08], opacity: [0.12, 0.58, 0.12] }} transition={shouldReduceMotion ? { duration: 0 } : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} /> </svg>
}
