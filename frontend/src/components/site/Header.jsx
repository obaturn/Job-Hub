import { ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV, marketingSections } from '../../app/navigation'
import CareerMark from './CareerMark'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const resourcesRef = useRef(null)

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!resourcesRef.current?.contains(event.target)) setResourcesOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setResourcesOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const closeMenus = () => {
    setMenuOpen(false)
    setResourcesOpen(false)
  }

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link to={NAV.home} aria-label="JobHub home" onClick={closeMenus}><CareerMark /></Link>
        <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
          {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
        <nav className={`site-nav${menuOpen ? ' site-nav--open' : ''}`} aria-label="Main navigation">
          {marketingSections.map((item) => <Link key={item.to} to={item.to} onClick={closeMenus}>{item.label}</Link>)}
          <div className="resources-menu" ref={resourcesRef}>
            <button type="button" className="resources-menu__trigger" aria-haspopup="true" aria-expanded={resourcesOpen} onClick={() => setResourcesOpen((open) => !open)}>
              Resources <ChevronDown size={14} aria-hidden="true" />
            </button>
            {resourcesOpen && <div className="resources-menu__panel" role="menu">
              <Link role="menuitem" to={NAV.about} onClick={closeMenus}>About JobHub</Link>
              <Link role="menuitem" to={NAV.contact} onClick={closeMenus}>Contact</Link>
              <Link role="menuitem" to={NAV.help} onClick={closeMenus}>Help Center</Link>
            </div>}
          </div>
          <div className="site-nav__actions">
            <Link className="button button--outline button--small" to={NAV.login} onClick={closeMenus}>Sign in</Link>
            <Link className="button button--primary button--small" to={NAV.register} onClick={closeMenus}>Sign up</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
