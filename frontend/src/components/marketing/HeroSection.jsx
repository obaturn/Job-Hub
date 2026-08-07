import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NAV } from '../../app/navigation'
import { landingContent } from '../../data/landingContent'
import Button from '../Button'
import CareerGrowthGraphic from './CareerGrowthGraphic'

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  return (
    <section className="hero-section">
      <div className="hero-section__grid" aria-hidden="true" />
      <div className="container hero-section__inner">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.65, ease: 'easeOut' }}>
          <p className="eyebrow"><span className="eyebrow__dot" />{landingContent.hero.eyebrow}</p>
          <h1>{landingContent.hero.title}</h1>
          <p className="hero-copy__description">{landingContent.hero.description}</p>
          <div className="hero-copy__actions"><Link className="button button--primary button--large" to={NAV.register}>Get started <ArrowUpRight size={18} aria-hidden="true" /></Link><Link className="text-link" to={NAV.howItWorks}>See how it works <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
          <div className="hero-proof"><span className="hero-proof__avatars"><i>AO</i><i>DM</i><i>LB</i></span><span><strong>Made for momentum</strong><br />A clearer way to move forward.</span></div>
        </motion.div>
        <CareerGrowthGraphic />
      </div>
    </section>
  )
}
