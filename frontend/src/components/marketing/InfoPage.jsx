import { Link, useParams } from 'react-router-dom'
import { NAV } from '../../app/navigation'
import CareerMark from '../site/CareerMark'

const pageContent = {
  about: ['About JobHub', 'JobHub is a professional identity platform for people building their next chapter with intention.', 'We are creating a clearer way to present your strengths, discover possibilities, and keep moving forward.'],
  contact: ['Contact', 'We would love to hear from you.', 'For questions about JobHub, send a note to hello@jobhub.example and our team will get back to you.'],
  help: ['Help Center', 'A clearer answer is usually one step away.', 'Our help center is being prepared for the first JobHub community. In the meantime, reach out to hello@jobhub.example.'],
  privacy: ['Privacy Policy', 'Your trust matters.', 'This placeholder explains where the production privacy policy will live before public launch.'],
  terms: ['Terms of Service', 'The foundation for a respectful community.', 'This placeholder explains where the production terms will live before public launch.'],
}

export default function InfoPage({ pageSlug }) {
  const { slug: routeSlug } = useParams()
  const slug = pageSlug || routeSlug
  const [title, heading, copy] = pageContent[slug] || pageContent.about
  return <main className="info-page"><header className="info-page__header container"><Link to={NAV.home} aria-label="JobHub home"><CareerMark /></Link><Link className="button button--outline button--small" to={NAV.register}>Sign up</Link></header><section className="container info-page__content"><p className="eyebrow">JobHub resources</p><h1>{title}</h1><h2>{heading}</h2><p>{copy}</p><Link className="button button--primary" to={NAV.home}>Back to JobHub</Link></section></main>
}
