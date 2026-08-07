import Header from '../components/site/Header'
import Footer from '../components/site/Footer'
import HeroSection from '../components/marketing/HeroSection'
import ValueGrid from '../components/marketing/ValueGrid'
import ProcessSteps from '../components/marketing/ProcessSteps'
import TestimonialGrid from '../components/marketing/TestimonialGrid'
import FAQAccordion from '../components/marketing/FAQAccordion'
import SectionHeading from '../components/SectionHeading'
import { landingContent } from '../data/landingContent'

export default function LandingPage() {
  return <div className="site-shell"><Header /><main><HeroSection /><ValueGrid values={landingContent.values} /><ProcessSteps /><TestimonialGrid testimonials={landingContent.testimonials} /><section className="section faq-section" id="faq"><div className="container faq-layout"><SectionHeading eyebrow="Questions, answered" title="Start with clarity" description="Everything you need to know before taking your first step with JobHub." /><FAQAccordion items={landingContent.faqs} /></div></section></main><Footer /></div>
}
