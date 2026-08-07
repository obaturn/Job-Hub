export const NAV = {
  home: '/',
  register: '/register',
  login: '/login',
  verifyPending: '/verification/pending',
  verifyEmail: '/verification',
  legacyVerifyPending: '/verify-email/pending',
  legacyVerifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  profileSetup: '/profile/setup',
  product: '/product',
  howItWorks: '/how-it-works',
  faq: '/faq',
  about: '/about',
  contact: '/contact',
  help: '/help',
  privacy: '/privacy',
  terms: '/terms',
}

export const marketingSections = [
  { label: 'Product', to: NAV.product },
  { label: 'How it works', to: NAV.howItWorks },
  { label: 'FAQ', to: NAV.faq },
]
