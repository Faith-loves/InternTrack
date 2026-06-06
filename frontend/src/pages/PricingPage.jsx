import { Link } from 'react-router-dom'
import { Button, PublicPageShell } from '../components'

const included = [
  'Unlimited application tracking',
  'Companies, interviews, documents, and analytics',
  'Follow-up and interview reminders',
  'Demo account for recruiters',
  'Profile, settings, and dashboard customization',
  'AI email generators when enabled',
]

function PricingPage() {
  return (
    <PublicPageShell
      eyebrow="Pricing"
      title="Start free while you build your career pipeline."
      description="InternTrack is designed to be accessible for students and early-career candidates. Keep your search organized without adding another expensive tool."
    >
      <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="glass-panel border-emerald-300/30 p-8">
          <p className="text-sm font-bold text-emerald-300">Free Plan</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-6xl font-black text-white">$0</span>
            <span className="pb-2 text-slate-400">/ month</span>
          </div>
          <p className="mt-5 leading-7 text-slate-300">Everything you need to manage internship and job applications while the product grows.</p>
          <Link to="/signup" className="mt-8 inline-flex">
            <Button className="bg-emerald-500 text-white hover:bg-emerald-400">Get Started Free</Button>
          </Link>
        </article>

        <article className="glass-panel p-8">
          <h2 className="text-2xl font-black text-white">What is included</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-200">
                <span className="mr-2 text-emerald-300">+</span>
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </PublicPageShell>
  )
}

export default PricingPage
