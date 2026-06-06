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
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

export function updateStoredUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('refreshToken')
}
