import { Link } from 'react-router-dom'
import { Button } from '../components'

function LandingPage() {
  const navItems = [
    ['Features', '/features'],
    ['How It Works', '/how-it-works'],
    ['Pricing', '/pricing'],
    ['Resources', '/resources'],
    ['Contact', '/contact'],
  ]
  const sideLinks = ['Dashboard', 'Applications', 'Companies', 'Interviews', 'Documents', 'Analytics', 'Settings']
  const stats = [
    ['Total Applications', '24', '12% from last month', 'A'],
    ['Interviewing', '6', '20% from last month', 'I'],
    ['Offers', '2', '100% from last month', 'O'],
    ['Follow-ups Due', '5', 'Due this week', 'F'],
  ]
  const features = [
    ['Track Progress', 'From application to offer'],
    ['Interview Ready', 'Plan, prepare, and succeed'],
    ['Smart Reminders', 'Never miss a follow-up or deadline'],
    ['Powerful Insights', 'Understand what works best'],
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06131f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_34%_32%,rgba(14,165,145,0.16),transparent_32%),linear-gradient(180deg,#06131f_0%,#081725_56%,#06131f_100%)]" />
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-35" />
      <div className="pointer-events-none absolute -right-24 top-20 h-80 w-[54rem] ribbon-wave ribbon-wave-top" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-[28rem] w-[70rem] ribbon-wave ribbon-wave-bottom" />

      <header className="relative z-20 border-b border-white/8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="brand-mark">
              <span />
            </span>
            <span className="text-2xl font-black tracking-normal">InternTrack</span>
          </Link>

          <nav className="hidden items-center gap-10 text-sm font-medium text-slate-200 md:flex">
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

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-14 md:min-h-[calc(100vh-88px)] md:grid-cols-[0.9fr_1.1fr] md:px-8 md:pb-28 lg:pt-20">
          <div className="animate-rise">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-medium text-emerald-300 shadow-2xl shadow-emerald-950/30 backdrop-blur">
              <span className="sparkle-icon" />
              Your Complete Career Command Center
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
              Track applications.
              <br />
              Prepare interviews.
              <br />
              <span className="text-emerald-400">Land offers.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              The all-in-one internship and job application tracker that helps you stay organized, prepared, and ahead.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link to="/signup">
                <Button className="h-14 w-full rounded-lg bg-emerald-500 px-8 text-base text-white shadow-2xl shadow-emerald-500/25 hover:bg-emerald-400 sm:w-auto">
                  Get Started Free
                  <span aria-hidden="true">-&gt;</span>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="h-14 w-full rounded-lg border-white/20 bg-white/[0.04] px-8 text-base text-white backdrop-blur hover:bg-white/10 sm:w-auto">
                  View Demo
                  <span aria-hidden="true">Play</span>
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-2 gap-5 sm:grid-cols-4">
              {features.map(([title, body], index) => (
                <div key={title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-300/25 bg-white/[0.04] text-sm font-black text-emerald-300 shadow-lg shadow-emerald-950/20 backdrop-blur">
                    {index + 1}
                  </div>
                  <p className="mt-3 text-sm font-bold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-dashboard-wrap">
            <div className="hero-dashboard">
              <aside className="hidden w-48 shrink-0 border-r border-white/10 p-5 lg:block">
                <div className="mb-8 flex items-center gap-2 text-lg font-black italic">
                  <span className="mini-brand-mark" />
                  InternTrack
                </div>
                <div className="space-y-3">
                  {sideLinks.map((link, index) => (
                    <div
                      key={link}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-xs font-semibold ${
                        index === 0 ? 'bg-emerald-500/25 text-emerald-200 ring-1 ring-emerald-400/25' : 'text-slate-300'
                      }`}
                    >
                      <span className="h-4 w-4 rounded border border-current opacity-80" />
                      {link}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-6 left-5 flex items-center gap-3 text-xs text-slate-300">
                  <span className="h-9 w-9 rounded-full bg-emerald-400/80" />
                  <div>
                    <p className="font-bold text-white">Jane Doe</p>
                    <p>jane.doe@email.com</p>
                  </div>
                </div>
              </aside>

              <div className="min-w-0 flex-1 p-4 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black italic text-white">Welcome back, Jane!</h2>
                    <p className="mt-1 text-xs text-slate-400">Here is what is happening with your applications.</p>
                  </div>
                  <button className="rounded-lg border border-white/10 px-4 py-2 text-xs text-slate-300" type="button">
                    This Month
                  </button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map(([label, value, note, icon]) => (
                    <div key={label} className="glass-panel p-4">
                      <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-sm font-black text-emerald-300">
                        {icon}
                      </div>
                      <p className="text-xs text-slate-300">{label}</p>
                      <p className="mt-2 text-3xl font-black text-white">{value}</p>
                      <p className="mt-2 text-xs text-emerald-300">{note}</p>
                    </div>
                  ))}
                </div>

                <section className="glass-panel mt-4 p-5">
                  <h3 className="text-sm font-black italic text-white">Application Timeline</h3>
                  <div className="mt-7">
                    <div className="relative h-2 rounded-full bg-slate-700">
                      <div className="timeline-line absolute inset-y-0 left-0 w-[78%] rounded-full" />
                      {[
                        ['Applied', '24', 'left-[4%]', 'bg-emerald-400'],
                        ['Assessment', '8', 'left-[33%]', 'bg-cyan-400'],
                        ['Interview', '6', 'left-[62%]', 'bg-blue-500'],
                        ['Offer', '2', 'left-[86%]', 'bg-violet-500'],
                      ].map(([label, value, position, color]) => (
                        <div key={label} className={`absolute top-1/2 ${position} -translate-y-1/2`}>
                          <span className={`block h-4 w-4 rounded-full ${color} ring-4 ring-slate-950/80`} />
                          <p className="mt-3 -translate-x-1/3 text-xs text-slate-400">{label}</p>
                          <p className="mt-1 -translate-x-1/3 text-lg font-black text-emerald-300">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
                  <section className="glass-panel p-5">
                    <h3 className="text-sm font-black italic text-white">Upcoming Reminders</h3>
                    <div className="mt-4 space-y-3 text-xs">
                      {[
                        ['Follow up with Acme Corp', 'Today', 'text-amber-300'],
                        ['Interview with TechNova', 'Tomorrow', 'text-sky-300'],
                        ['Follow up with DesignHub', 'Fri, May 23', 'text-slate-300'],
                      ].map(([item, date, color]) => (
                        <div key={item} className="flex items-center justify-between gap-4">
                          <span className="text-slate-300">{item}</span>
                          <span className={color}>{date}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="glass-panel p-5">
                    <h3 className="text-sm font-black italic text-white">Recent Activity</h3>
                    <div className="mt-4 space-y-3 text-xs text-slate-300">
                      <p>Application submitted to Acme Corp <span className="float-right text-slate-500">2h ago</span></p>
                      <p>Interview scheduled with TechNova <span className="float-right text-slate-500">5h ago</span></p>
                      <p>Company updated: DesignHub <span className="float-right text-slate-500">1d ago</span></p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="relative border-t border-white/10 px-4 py-16 text-center md:px-8">
          <p className="text-sm font-bold text-emerald-300">Everything You Need</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black text-white md:text-4xl">
            All-in-one platform to manage your journey
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Powerful features designed to help you stay organized and achieve your career goals.
          </p>
        </section>
      </main>
    </div>
  )
}

export default LandingPage
