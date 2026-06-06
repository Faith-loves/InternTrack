import Badge from './Badge'
import { APPLICATION_STATUSES, formatDate, getStatusLabel, getStatusTone, timelineStatuses } from '../utils/applications'

function ApplicationTimeline({ application }) {
  const currentIndex = timelineStatuses.indexOf(application.status)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-950">Application timeline</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {timelineStatuses.map((status, index) => {
            const isDone = currentIndex >= index || application.status === APPLICATION_STATUSES.OFFER
            const isCurrent = application.status === status

            return (
              <div
                key={status}
                className={`rounded-lg border p-4 ${
                  isDone ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {index + 1}
                </div>
                <p className="font-semibold text-slate-950">{getStatusLabel(status)}</p>
                {isCurrent && <p className="mt-1 text-xs font-semibold text-emerald-700">Current stage</p>}
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-950">Status history</h3>
        {application.statusHistory?.length > 0 ? (
          <div className="mt-4 space-y-3">
            {application.statusHistory.map((item, index) => (
              <div key={`${item.status}-${item.changedAt}-${index}`} className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <Badge tone={getStatusTone(item.status)}>{getStatusLabel(item.status)}</Badge>
                <span className="text-sm text-slate-500">{formatDate(item.changedAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No status history yet.</p>
        )}
      </div>
    </div>
  )
}

export default ApplicationTimeline
