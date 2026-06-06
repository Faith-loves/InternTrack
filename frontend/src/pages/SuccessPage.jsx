import { Link, useSearchParams } from 'react-router-dom'
import { Button, Card } from '../components'

const copy = {
  'application-created': {
    title: 'Application saved',
    message: 'The opportunity is now in your tracker.',
    action: 'View application',
  },
  'profile-updated': {
    title: 'Profile updated',
    message: 'Your profile details are ready for the next application.',
    action: 'Back to settings',
  },
  default: {
    title: 'Success',
    message: 'Your update has been saved.',
    action: 'Continue',
  },
}

function SuccessPage() {
  const [searchParams] = useSearchParams()
  const kind = searchParams.get('kind') || 'default'
  const next = searchParams.get('next') || '/dashboard'
  const content = copy[kind] || copy.default

  return (
    <div className="flex min-h-[65vh] items-center justify-center">
      <Card className="w-full max-w-xl p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl font-black text-emerald-700">
          ✓
        </div>
        <h2 className="mt-5 text-2xl font-bold text-slate-950">{content.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{content.message}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={next}>
            <Button className="w-full sm:w-auto">{content.action}</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" className="w-full sm:w-auto">Dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default SuccessPage
