import { NavLink, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { clearSession, getStoredRefreshToken } from '../utils/authStorage'
import { dashboardLinks } from '../utils/navigation'

function Sidebar() {
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
    <aside className="hidden min-h-screen w-64 border-r border-emerald-100 bg-white px-4 py-5 text-slate-900 shadow-xl shadow-emerald-950/5 lg:block">
      <NavLink to="/" className="mb-8 flex items-center gap-3 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-500/20">
          I
        </span>
        <div>
          <p className="text-base font-bold">InternTrack</p>
          <p className="text-xs text-slate-500">Application manager</p>
        </div>
      </NavLink>

      <nav className="space-y-1">
        {dashboardLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-xs font-bold text-emerald-700 transition group-hover:bg-emerald-100 group-[.active]:bg-white/20">
              {link.icon}
            </span>
            {link.name}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        className="mt-8 w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
