import { Link } from 'react-router-dom'
import Button from './Button'
import Card from './Card'

function OnboardingCard({ onDismiss }) {
  return (
    <Card className="border-emerald-200 bg-emerald-50 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Start strong</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Add your first application, complete your profile, and upload a CV so reminders and analytics have useful data.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/applications/add">
            <Button className="w-full sm:w-auto">Add application</Button>
          </Link>
          <Link to="/settings">
            <Button variant="secondary" className="w-full sm:w-auto">Complete profile</Button>
          </Link>
          <Button variant="ghost" className="w-full sm:w-auto" onClick={onDismiss}>Dismiss</Button>
        </div>
      </div>
    </Card>
  )
}

export default OnboardingCard
