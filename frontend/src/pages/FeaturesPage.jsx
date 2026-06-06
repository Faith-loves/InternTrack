import { Link } from 'react-router-dom'
import { Button, PublicPageShell } from '../components'

const features = [
  ['Application tracking', 'Keep every role, company, status, recruiter, deadline, document, and note in one organized pipeline.'],
  ['Smart reminders', 'See follow-ups that are due, overdue applications, and interviews happening today or this week.'],
  ['Interview workspace', 'Prepare checklists, notes, feedback, outcomes, thank-you emails, and calendar-ready interview details.'],
  ['Document management', 'Track CVs, cover letters, portfolio files, document versions, and which document was used for each role.'],
  ['Analytics and insights', 'Measure response rate, offer rate, interviews, rejection trends, monthly activity, and best-performing CVs.'],
  ['AI helpers', 'Generate follow-up emails, thank-you notes, interview preparation ideas, and application improvement insights.'],
]

function FeaturesPage() {
  return (
    <PublicPageShell
      eyebrow="Everything You Need"
      title="Powerful features for every step of your application journey."
      description="InternTrack helps you move from scattered spreadsheets and forgotten follow-ups to a clear, focused career command center."
    >
      <section className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map(([title, body], index) => (
          <article key={title} className="glass-panel p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/15 text-sm font-black text-emerald-300">
              {index + 1}
            </div>
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Ready to organize your search?</h2>
          <p className="mt-2 text-slate-300">Start tracking applications with a cleaner workflow today.</p>
        </div>
        <Link to="/signup" className="mt-5 inline-flex sm:mt-0">
          <Button className="bg-emerald-500 text-white hover:bg-emerald-400">Get Started Free</Button>
        </Link>
      </section>
    </PublicPageShell>
  )
}

export default FeaturesPage
