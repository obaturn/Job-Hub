import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NAV } from '../../app/navigation'
import { landingContent } from '../../data/landingContent'

export default function ProcessSteps() {
  const shouldReduceMotion = useReducedMotion()
  return <section className="section process-section" id="how-it-works"><div className="container process-layout"><div className="process-intro"><p className="eyebrow">How it works</p><h2>A simple path to a stronger professional future.</h2><p>Start with where you are. JobHub helps you make the next step feel clear, useful, and yours.</p><Link className="text-link" to={NAV.register}>Start building <ArrowUpRight size={16} aria-hidden="true" /></Link></div><div className="process-list">{landingContent.steps.map((step, index) => <motion.div className={`process-step${index === 0 ? ' process-step--active' : ''}`} key={step.number} initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: shouldReduceMotion ? 0 : index * 0.06, duration: shouldReduceMotion ? 0 : 0.4 }}><span className="process-step__number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><ArrowUpRight className="process-step__arrow" size={18} aria-hidden="true" /></motion.div>)}</div></div></section>
}
