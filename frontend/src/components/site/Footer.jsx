import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NAV } from '../../app/navigation'
import CareerMark from './CareerMark'
import FooterMotif from './FooterMotif'

const socialLinks = [
  ['in', 'LinkedIn', 'https://www.linkedin.com'],
  ['X', 'X', 'https://x.com'],
  ['◎', 'Instagram', 'https://www.instagram.com'],
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <section className="footer-cta">
        <FooterMotif />
        <div className="container footer-cta__inner">
          <div><p className="eyebrow eyebrow--light">Your next move is worth making</p><h2>Build your professional story. Grow with direction.</h2><p>Join JobHub and create the foundation for the career you want next.</p></div>
          <Link className="button button--light button--large" to={NAV.register}>Get started today <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
      <section className="footer-main">
        <div className="container footer-main__grid">
          <div className="footer-brand"><Link to={NAV.home} aria-label="JobHub home"><CareerMark light /></Link><p>Your professional identity for every next step.</p><div className="footer-socials">{socialLinks.map(([mark, label, href]) => <a className="footer-social" key={label} href={href} target="_blank" rel="noreferrer" aria-label={`JobHub on ${label}`}><span>{mark}</span>{label}</a>)}</div></div>
          <div className="footer-links"><div><strong>Explore</strong><Link to={NAV.product}>Product</Link><Link to={NAV.howItWorks}>How it works</Link><Link to={NAV.faq}>FAQ</Link></div><div><strong>Company</strong><Link to={NAV.about}>About JobHub</Link><Link to={NAV.contact}>Contact</Link><Link to={NAV.help}>Help Center</Link></div><div><strong>Legal</strong><Link to={NAV.terms}>Terms of Service</Link><Link to={NAV.privacy}>Privacy Policy</Link></div></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 JobHub</span><span>Professional identity · Career momentum</span><span><Link to={NAV.terms}>Terms</Link><b>•</b><Link to={NAV.privacy}>Privacy</Link></span></div>
      </section>
    </footer>
  )
}
