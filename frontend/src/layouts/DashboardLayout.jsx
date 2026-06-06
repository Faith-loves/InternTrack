import { NavLink, Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { dashboardLinks } from '../utils/navigation'

function DashboardLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f0fdfa_0%,#f8fbff_18rem,#f7faf9_100%)]">
      <div className="flex min-w-0">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <TopBar />
          <nav className="flex gap-2 overflow-x-auto border-b border-emerald-100 bg-white/95 px-4 py-3 shadow-sm lg:hidden">
            {dashboardLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
