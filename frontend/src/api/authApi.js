import { http } from './httpClient'

export const authApi = {
  register: (payload) => http.post('/api/v1/auth/register', payload),
  login: (payload) => http.post('/api/v1/auth/login', payload),
  verifyEmail: (payload) => http.post('/api/v1/auth/verify-email', payload),
  resendVerification: (payload) => http.post('/api/v1/auth/resend-verification', payload),
  refreshToken: (payload) => http.post('/api/v1/auth/refresh-token', payload),
  logout: (payload) => http.post('/api/v1/auth/logout', payload),
  forgotPassword: (payload) => http.post('/api/v1/auth/forgot-password', payload),
  resetPassword: (payload) => http.post('/api/v1/auth/reset-password', payload),
}
