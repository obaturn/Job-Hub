import { motion, useReducedMotion } from 'motion/react'
import SectionHeading from '../SectionHeading'

export default function TestimonialGrid({ testimonials }) {
  const shouldReduceMotion = useReducedMotion()
  return <section className="section testimonials-section"><div className="container"><SectionHeading eyebrow="Proof of progress" title="Built for people with somewhere to go" description="A professional platform should feel as considered as the future you are building." align="center" /><div className="testimonial-grid">{testimonials.map((testimonial, index) => <motion.article className="testimonial-card" key={testimonial.name} initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: shouldReduceMotion ? 0 : index * 0.07, duration: shouldReduceMotion ? 0 : 0.45 }}><div className="testimonial-card__quote">“</div><p>{testimonial.quote}</p><div className="testimonial-card__person"><span className="testimonial-card__avatar">{testimonial.name.split(' ').map((name) => name[0]).join('')}</span><span><strong>{testimonial.name}</strong><small>{testimonial.role}</small></span></div></motion.article>)}</div></div></section>
}
