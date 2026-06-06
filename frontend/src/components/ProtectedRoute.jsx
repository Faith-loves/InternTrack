import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from './Loader'
import { authService } from '../services/authService'
import { clearSession, getStoredRefreshToken, getStoredToken, saveSession, updateStoredUser } from '../utils/authStorage'

function ProtectedRoute() {
  const location = useLocation()
  const [checkingSession, setCheckingSession] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredToken()))

  useEffect(() => {
    async function refreshUser() {
      const token = getStoredToken()

      if (!token && getStoredRefreshToken()) {
        try {
          const { data } = await authService.refreshSession(getStoredRefreshToken())
          saveSession(data.token, data.user, data.refreshToken)
          setIsAuthenticated(true)
        } catch {
          clearSession()
          setIsAuthenticated(false)
        } finally {
          setCheckingSession(false)
        }
        return
      }

      if (!token) {
        setIsAuthenticated(false)
        setCheckingSession(false)
        return
      }

      try {
        const { data } = await authService.getCurrentUser()
        updateStoredUser(data.user)
        setIsAuthenticated(true)
      } catch {
        clearSession()
        setIsAuthenticated(false)
      } finally {
        setCheckingSession(false)
      }
    }

    refreshUser()
  }, [])

  if (checkingSession) {
    return <Loader label="Checking session" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
