import { motion, useReducedMotion } from 'motion/react'
import { Check, CircleUserRound, TrendingUp } from 'lucide-react'

export default function CareerGrowthGraphic() {
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.div className="career-graphic" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: 'easeOut' }}>
      <motion.div className="career-graphic__float" animate={shouldReduceMotion ? { y: 0, rotate: 0 } : { y: [0, -7, 0], rotate: [0, 0.7, 0] }} transition={{ duration: 7, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}>
        <div className="career-graphic__halo" />
        <div className="career-graphic__panel career-graphic__panel--forest" />
        <div className="career-graphic__panel career-graphic__panel--gray" />
        <div className="career-graphic__panel career-graphic__panel--orange" />
        <div className="career-graphic__panel career-graphic__panel--sage" />
        <svg className="career-graphic__path" viewBox="0 0 430 360" aria-hidden="true"><path d="M49 279c61-17 57-110 129-125 59-12 74-37 109-80" /><path d="m268 74 22-1-10 20" /></svg>
        <span className="career-graphic__node" />
        <motion.div className="career-mini-card career-mini-card--profile" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.35, duration: 0.45 }}><span className="career-mini-card__icon"><CircleUserRound size={15} aria-hidden="true" /></span><span><strong>Professional profile</strong><small>Ready to grow</small></span><span className="career-mini-card__check"><Check size={12} aria-hidden="true" /></span></motion.div>
        <motion.div className="career-mini-card career-mini-card--growth" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: shouldReduceMotion ? 0 : 0.55, duration: 0.45 }}><span className="career-mini-card__metric">3.2k<small>+</small></span><span><strong>professionals</strong><small>moving forward</small></span><TrendingUp size={16} aria-hidden="true" /></motion.div>
      </motion.div>
    </motion.div>
  )
}
