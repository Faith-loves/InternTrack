import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { authService } from '../services/authService'
import { clearSession, getStoredRefreshToken } from '../utils/authStorage'

function TopBar() {
  const navigate = useNavigate()

  async function handleLogout() {
    if (!window.confirm('Are you sure you want to log out?')) return

    const refreshToken = getStoredRefreshToken()
    if (refreshToken) {
      await authService.logout(refreshToken).catch(() => {})
    }

    clearSession()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-emerald-100 bg-white/90 px-4 py-3 text-slate-950 shadow-sm backdrop-blur md:px-8">
      <div className="min-w-0">
        <p className="hidden text-sm font-semibold text-emerald-700 sm:block">Welcome back</p>
        <h1 className="truncate text-base font-semibold text-slate-950 sm:text-lg">Track your internship journey</h1>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Button variant="secondary" className="hidden border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 sm:inline-flex">
          Upload document
        </Button>
        <Button variant="ghost" className="px-3 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-950" onClick={handleLogout}>
          Logout
        </Button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
          IT
        </div>
      </div>
    </header>
  )
}

export default TopBar
