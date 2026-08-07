import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function FAQAccordion({ items, initialOpenId = items[0]?.id }) {
  const [openId, setOpenId] = useState(initialOpenId)
  const shouldReduceMotion = useReducedMotion()

  return <div className="faq-list">{items.map((item) => {
    const isOpen = openId === item.id
    const answerId = `${item.id}-answer`
    return <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`} key={item.id}>
      <button type="button" className="faq-item__trigger" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenId(isOpen ? null : item.id)}>
        <span>{item.question}</span><ChevronDown size={19} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && <motion.div id={answerId} className="faq-answer" role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: 'easeOut' }}><p>{item.answer}</p></motion.div>}
      </AnimatePresence>
    </div>
  })}</div>
}
