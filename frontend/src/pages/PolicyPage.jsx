import { Link } from 'react-router-dom'
import { Card } from '../components'

const content = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      ['Data we store', 'InternTrack stores account profile details, applications, companies, interviews, documents, analytics, and preferences needed to run the product.'],
      ['How data is used', 'Your data is used to provide tracking, reminders, analytics, account security, and document management.'],
      ['Uploads', 'Documents may be stored locally in development or in Cloudinary when production credentials are configured.'],
      ['Account deletion', 'You can request account deletion from the backend endpoint, which removes your user-owned records.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    sections: [
      ['Use of InternTrack', 'InternTrack is a job-search organization tool. You are responsible for the accuracy of the information you add.'],
      ['No employment guarantee', 'InternTrack helps organize applications and insights, but it does not guarantee interviews, offers, or employment outcomes.'],
      ['Account responsibility', 'Keep your login details private and use the service responsibly.'],
      ['Service changes', 'Features may change as the product improves, especially while it is in active development.'],
    ],
  },
}

function PolicyPage({ type }) {
  const page = content[type]

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm font-semibold text-emerald-700">Back to home</Link>
        <Card className="mt-5 p-6">
          <h1 className="text-3xl font-black text-slate-950">{page.title}</h1>
          <div className="mt-6 space-y-5">
            {page.sections.map(([title, body]) => (
              <section key={title}>
                <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </section>
            ))}
          </div>
        </Card>
      </section>
    </main>
  )
}

export default PolicyPage
