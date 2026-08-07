import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import FAQAccordion from '../components/marketing/FAQAccordion'
import Footer from '../components/site/Footer'
import Header from '../components/site/Header'
import ProcessSteps from '../components/marketing/ProcessSteps'
import SectionHeading from '../components/SectionHeading'
import ValueGrid from '../components/marketing/ValueGrid'
import { NAV } from '../app/navigation'
import { landingContent } from '../data/landingContent'

function MarketingHero({ eyebrow, title, description, children }) {
  return <section className="marketing-page__hero"><div className="container marketing-page__hero-inner"><p className="eyebrow"><span className="eyebrow__dot" />{eyebrow}</p><h1>{title}</h1><p>{description}</p>{children}</div></section>
}

function MarketingCta({ title, description }) {
  return <section className="marketing-page__cta"><div className="container marketing-page__cta-inner"><div><p className="eyebrow eyebrow--light">Keep moving with JobHub</p><h2>{title}</h2><p>{description}</p></div><Link className="button button--light button--large" to={NAV.register}>Create your account <ArrowUpRight size={18} aria-hidden="true" /></Link></div></section>
}

export function ProductPage() {
  return <div className="site-shell"><Header /><main className="marketing-page marketing-page--product"><MarketingHero eyebrow="Product" title="A clearer professional identity for every next step." description="JobHub brings your experience, strengths, and ambitions into one place so you can present yourself with confidence and keep your direction visible."><Link className="button button--primary button--large" to={NAV.register}>Build your profile <ArrowUpRight size={18} aria-hidden="true" /></Link></MarketingHero><ValueGrid values={landingContent.values} /><section className="section marketing-proof"><div className="container marketing-proof__layout"><SectionHeading eyebrow="Built around you" title="Less noise. More direction." description="Your profile should do more than list your history. It should help people understand your value and help you decide what comes next." /><ul className="marketing-proof__list">{['Present your strengths in one clear story', 'Keep your goals and career preferences visible', 'Stay ready for the opportunities that fit your direction'].map((item) => <li key={item}><CheckCircle2 size={18} aria-hidden="true" />{item}</li>)}</ul></div></section></main><Footer /></div>
}

export function HowItWorksPage() {
  return <div className="site-shell"><Header /><main className="marketing-page marketing-page--how-it-works"><MarketingHero eyebrow="How it works" title="A simple path from where you are to what comes next." description="Start with the essentials, make your experience easier to understand, and keep building from there."><Link className="button button--primary button--large" to={NAV.register}>Start your journey <ArrowUpRight size={18} aria-hidden="true" /></Link></MarketingHero><ProcessSteps /><MarketingCta title="Your next step can start today." description="Create your JobHub account and begin turning your experience into a clearer professional story." /></main><Footer /></div>
}

export function FaqPage() {
  return <div className="site-shell"><Header /><main className="marketing-page marketing-page--faq"><MarketingHero eyebrow="Questions, answered" title="Start with clarity before you start moving." description="Find answers about creating your account, building your profile, and using JobHub as your career direction evolves." /><section className="section faq-section"><div className="container faq-layout"><SectionHeading eyebrow="JobHub FAQ" title="The answers you need before your first step." description="Still unsure? Start by creating an account and discover the experience for yourself." /><FAQAccordion items={landingContent.faqs} /></div></section><MarketingCta title="Ready to build your next chapter?" description="Create your account, verify your email, and start building with direction." /></main><Footer /></div>
}
