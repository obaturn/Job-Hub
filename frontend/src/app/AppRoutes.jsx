import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import { FaqPage, HowItWorksPage, ProductPage } from '../pages/MarketingPages'
import { NAV } from './navigation'
import { getRememberedPath } from '../auth/returnPath'
import { getAuthCheckpoint, getPendingVerification } from '../auth/verificationState'
import { useAuth } from '../auth/AuthContext'
import LoadingScreen from '../components/LoadingScreen'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import { ForgotPasswordPage, ResetPasswordPage } from '../pages/PasswordRecoveryPages'
import { VerificationPendingPage, VerifyEmailPage } from '../pages/VerificationPages'
import ProfileSetupPlaceholderPage from '../pages/ProfileSetupPlaceholderPage'
import { GuestRoute, ProtectedRoute } from '../components/RouteGuards'
import InfoPage from '../components/marketing/InfoPage'

function LegacyVerificationRedirect({ pending = false }) {
  const location = useLocation()
  const destination = pending ? NAV.verifyPending : NAV.verifyEmail
  return <Navigate to={`${destination}${location.search}${location.hash}`} replace />
}

function ResumeRoute() {
  const { status } = useAuth()
  if (status === 'unknown') return <LoadingScreen />
  if (status === 'authenticated') return <Navigate to={getRememberedPath()} replace />

  const pendingVerification = getPendingVerification()
  if (pendingVerification) return <Navigate to={NAV.verifyPending} state={pendingVerification} replace />
  if (getAuthCheckpoint() === NAV.login) return <Navigate to={NAV.login} replace />
  return <LandingPage />
}

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<ResumeRoute />} />
    <Route path={NAV.product} element={<ProductPage />} />
    <Route path={NAV.howItWorks} element={<HowItWorksPage />} />
    <Route path={NAV.faq} element={<FaqPage />} />
    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path={NAV.verifyPending} element={<VerificationPendingPage />} />
    <Route path={NAV.verifyEmail} element={<VerifyEmailPage />} />
    <Route path={NAV.legacyVerifyPending} element={<LegacyVerificationRedirect pending />} />
    <Route path={NAV.legacyVerifyEmail} element={<LegacyVerificationRedirect />} />
    <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/profile/setup" element={<ProtectedRoute><ProfileSetupPlaceholderPage /></ProtectedRoute>} />
    <Route path="/about" element={<InfoPage pageSlug="about" />} />
    <Route path="/contact" element={<InfoPage pageSlug="contact" />} />
    <Route path="/help" element={<InfoPage pageSlug="help" />} />
    <Route path="/privacy" element={<InfoPage pageSlug="privacy" />} />
    <Route path="/terms" element={<InfoPage pageSlug="terms" />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
