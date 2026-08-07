import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Handshake, Pause, Play, Route, Sparkles, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { NAV } from '../../app/navigation'
import SectionHeading from '../SectionHeading'

const icons = [UserRound, Route, Sparkles, Handshake]
const DEFAULT_ROTATION_INTERVAL = 4200

export default function ValueGrid({ values, rotationInterval = DEFAULT_ROTATION_INTERVAL }) {
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isManuallyPaused, setIsManuallyPaused] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isDocumentHidden, setIsDocumentHidden] = useState(false)

  useEffect(() => {
    const handleVisibilityChange = () => setIsDocumentHidden(document.hidden)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    if (shouldReduceMotion || values.length < 2 || isManuallyPaused || isInteracting || isDocumentHidden) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % values.length)
    }, rotationInterval)
    return () => window.clearInterval(timer)
  }, [isDocumentHidden, isInteracting, isManuallyPaused, rotationInterval, shouldReduceMotion, values.length])

  const pauseRotation = () => setIsManuallyPaused((paused) => !paused)
  const isPaused = shouldReduceMotion || isManuallyPaused

  return <section className="section value-section" id="product"><div className="container"><SectionHeading eyebrow="Why JobHub" title="A more intentional way to move forward" description="The right opportunity starts with a clear story. JobHub helps you build, share, and grow yours." /><div className="value-grid-toolbar"><p>See what moves with you.</p><button className="value-grid-toggle" type="button" onClick={pauseRotation} aria-pressed={isManuallyPaused} aria-label={isPaused ? 'Resume featured card rotation' : 'Pause featured card rotation'}>{isPaused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />} {isPaused ? 'Play cards' : 'Pause cards'}</button></div><div className="value-grid" onMouseEnter={() => setIsInteracting(true)} onMouseLeave={() => setIsInteracting(false)} onFocus={() => setIsInteracting(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsInteracting(false) }}>{values.map((item, index) => { const Icon = icons[index % icons.length]; const isFeatured = index === activeIndex; return <motion.article className={`value-card${isFeatured ? ' value-card--featured' : ''}`} key={item.number} initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: isFeatured && !shouldReduceMotion ? -4 : 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: shouldReduceMotion ? 0 : index * 0.06, duration: shouldReduceMotion ? 0 : 0.45, ease: 'easeOut' }}><span className="value-card__number">{item.number}</span><span className="value-card__icon"><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span><h3>{item.title}</h3><p>{item.text}</p><Link to={NAV.howItWorks} className="value-card__link">Learn more <ArrowUpRight size={15} aria-hidden="true" /></Link></motion.article> })}</div></div></section>
}
