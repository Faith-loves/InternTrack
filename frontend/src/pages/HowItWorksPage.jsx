import { Link } from 'react-router-dom'
import { Button, PublicPageShell } from '../components'

const steps = [
  ['Create your profile', 'Add your name, preferred role, location, portfolio, LinkedIn, GitHub, and career preferences.'],
  ['Add applications', 'Save each opportunity with company, role, status, date applied, recruiter details, CV used, notes, and follow-up date.'],
  ['Prepare interviews', 'Track interview dates, types, locations, preparation notes, feedback, outcomes, and thank-you emails.'],
  ['Review insights', 'Use analytics to understand your response rate, offer rate, active pipeline, and which applications need attention.'],
]

function HowItWorksPage() {
  return (
    <PublicPageShell
      eyebrow="Simple Workflow"
      title="From first application to final offer in four clear steps."
      description="InternTrack keeps the process practical: add opportunities, stay reminded, prepare better, and learn what is working."
    >
      <section className="mt-14 grid gap-6 lg:grid-cols-4">
        {steps.map(([title, body], index) => (
          <article key={title} className="relative glass-panel p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-lg font-black text-white">
              {index + 1}
            </span>
            <h2 className="mt-6 text-xl font-black text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="glass-panel p-7">
          <h2 className="text-2xl font-black text-white">A dashboard that tells you what to do next.</h2>
          <p className="mt-3 leading-7 text-slate-300">
            Your dashboard surfaces follow-ups, upcoming interviews, overdue applications, and recent progress so your next action is never buried.
          </p>
        </div>
        <div className="glass-panel p-7">
          <p className="text-sm font-bold text-emerald-300">Best for</p>
          <p className="mt-3 text-2xl font-black text-white">Students, interns, graduates, and early-career job seekers.</p>
          <Link to="/signup" className="mt-6 inline-flex">
            <Button className="bg-emerald-500 text-white hover:bg-emerald-400">Start tracking</Button>
          </Link>
        </div>
      </section>
    </PublicPageShell>
  )
}

export default HowItWorksPage
