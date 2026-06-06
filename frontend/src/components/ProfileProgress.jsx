import { Link } from 'react-router-dom'
import Button from './Button'
import Card from './Card'
import { getProfileCompletion } from '../utils/profile'

function ProfileProgress({ user }) {
  const progress = getProfileCompletion(user)

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Profile completion</h3>
          <p className="mt-1 text-sm text-slate-500">
            {progress.completed} of {progress.total} details completed
          </p>
        </div>
        <span className="text-2xl font-black text-slate-950">{progress.percent}%</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress.percent}%` }} />
      </div>
      {progress.missing.length > 0 && (
        <p className="mt-3 text-sm text-slate-500">Missing: {progress.missing.slice(0, 3).join(', ')}</p>
      )}
      <Link to="/settings" className="mt-4 inline-flex">
        <Button variant="secondary">Update profile</Button>
      </Link>
    </Card>
  )
}

export default ProfileProgress
