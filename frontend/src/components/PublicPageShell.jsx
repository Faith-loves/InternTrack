import { Link } from 'react-router-dom'
import Button from './Button'

const navItems = [
  ['Features', '/features'],
  ['How It Works', '/how-it-works'],
  ['Pricing', '/pricing'],
  ['Resources', '/resources'],
  ['Contact', '/contact'],
]

function PublicPageShell({ children, eyebrow, title, description }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06131f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(14,165,145,0.18),transparent_30%),linear-gradient(180deg,#06131f_0%,#081725_56%,#06131f_100%)]" />
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-30" />
      <div className="pointer-events-none absolute -right-28 top-24 h-72 w-[52rem] ribbon-wave ribbon-wave-top" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-96 w-[68rem] ribbon-wave ribbon-wave-bottom" />

      <header className="relative z-20 border-b border-white/8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="brand-mark">
              <span />
            </span>
            <span className="text-2xl font-black tracking-normal">InternTrack</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-200 lg:flex">
            {navItems.map(([label, path]) => (
              <Link key={path} to={path} className="transition hover:text-emerald-300">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:inline" to="/login">
              Log in
            </Link>
            <Link to="/signup">
              <Button className="bg-emerald-500 text-white shadow-xl shadow-emerald-500/25 hover:bg-emerald-400">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <section className="max-w-3xl">
          {eyebrow && <p className="text-sm font-bold text-emerald-300">{eyebrow}</p>}
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {description && <p className="mt-5 text-lg leading-8 text-slate-300">{description}</p>}
        </section>

        {children}
      </main>
    </div>
  )
}

export default PublicPageShell
