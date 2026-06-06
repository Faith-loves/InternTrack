import { Link } from 'react-router-dom'
import { Button, PublicPageShell } from '../components'

const resources = [
  ['Follow-up email guide', 'Learn when to follow up and what to say after applying or interviewing.'],
  ['Interview preparation checklist', 'A practical checklist for research, questions, documents, and post-interview notes.'],
  ['CV tracking strategy', 'Understand how to test different CV versions and track which ones perform best.'],
  ['Application pipeline template', 'Use InternTrack as your clean replacement for scattered spreadsheets.'],
]

function ResourcesPage() {
  return (
    <PublicPageShell
      eyebrow="Resources"
      title="Guides and templates to make your search sharper."
      description="Use these resources with InternTrack to stay consistent, prepare better, and improve each application cycle."
    >
      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {resources.map(([title, body]) => (
          <article key={title} className="glass-panel p-6">
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
            <Link className="mt-5 inline-flex text-sm font-bold text-emerald-300 hover:text-emerald-200" to="/signup">
              Use in InternTrack
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-7 text-center">
        <h2 className="text-2xl font-black text-white">Want a recruiter-friendly demo?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300">
          Use the demo login to preview the dashboard, applications, interviews, documents, and analytics without creating test data from scratch.
        </p>
        <Link to="/login" className="mt-6 inline-flex">
          <Button variant="secondary" className="border-white/20 bg-white/[0.06] text-white hover:bg-white/10">View Demo</Button>
        </Link>
      </section>
    </PublicPageShell>
  )
}

export default ResourcesPage
