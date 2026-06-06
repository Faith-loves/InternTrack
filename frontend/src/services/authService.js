import api from './api'

export const DEMO_CREDENTIALS = {
  email: 'demo@interntrack.com',
  password: 'DemoPassword123',
}

export const authService = {
  signup(payload) {
    return api.post('/auth/signup', payload)
  },
  login(payload) {
    return api.post('/auth/login', payload)
  },
  demoLogin() {
    return api.post('/auth/login', DEMO_CREDENTIALS)
  },
  refreshSession(refreshToken) {
    return api.post('/auth/refresh', { refreshToken })
  },
  logout(refreshToken) {
    return api.post('/auth/logout', { refreshToken })
  },
  getCurrentUser() {
    return api.get('/auth/me')
  },
  updateProfile(payload) {
    return api.put('/auth/me', payload)
  },
}
