const DEMO_SESSION_KEY = 'isDemoSession'
const DEMO_TOKEN = 'interntrack-demo-session'
const DEMO_USER = {
  id: 'demo-recruiter',
  fullName: 'Recruiter Demo',
  email: 'demo@interntrack.com',
  preferredRole: 'Frontend Intern',
  location: 'Lagos, Nigeria',
  portfolioLink: '',
  linkedinLink: '',
  githubLink: '',
  isEmailVerified: true,
}

export function getStoredToken() {
  return localStorage.getItem('token')
}

export function getStoredRefreshToken() {
  return localStorage.getItem('refreshToken')
}

export function getStoredUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function saveSession(token, user, refreshToken) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.removeItem(DEMO_SESSION_KEY)
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  } else {
    localStorage.removeItem('refreshToken')
  }
}

export function saveDemoSession() {
  localStorage.setItem('token', DEMO_TOKEN)
  localStorage.setItem('user', JSON.stringify(DEMO_USER))
  localStorage.setItem(DEMO_SESSION_KEY, 'true')
  localStorage.removeItem('refreshToken')
}

export function isDemoSession() {
  return localStorage.getItem(DEMO_SESSION_KEY) === 'true'
}

export function updateStoredUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem(DEMO_SESSION_KEY)
}
