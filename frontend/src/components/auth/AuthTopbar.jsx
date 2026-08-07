import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NAV } from '../../app/navigation'

export default function AuthTopbar({ authMode }) {
  const isLogin = authMode === 'login'
  return <div className="auth-topbar"><Link to={NAV.home} className="auth-back-link"><ArrowLeft size={15} aria-hidden="true" /> Back to home</Link><span className="auth-topbar__question">{isLogin ? 'New to JobHub?' : 'Already have an account?'} <Link to={isLogin ? NAV.register : NAV.login}>{isLogin ? 'Sign up' : 'Sign in'}</Link></span></div>
}
