import Card from './Card'

const options = [
  ['showStats', 'Stats'],
  ['showReminders', 'Reminders'],
  ['showInterviews', 'Interview warnings'],
  ['showRecentApplications', 'Recent applications'],
]

function DashboardCustomizer({ preferences, onChange }) {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold text-slate-950">Dashboard sections</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map(([key, label]) => (
          <label
            key={key}
            className={`flex min-h-14 items-center gap-3 rounded-md border px-3 py-2.5 text-sm font-semibold leading-5 transition ${
              preferences[key]
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              className="h-4 w-4 shrink-0 accent-emerald-600"
              checked={preferences[key]}
              onChange={(event) => onChange(key, event.target.checked)}
            />
            <span className="min-w-0">{label}</span>
          </label>
        ))}
      </div>
    </Card>
  )
}

export default DashboardCustomizer
