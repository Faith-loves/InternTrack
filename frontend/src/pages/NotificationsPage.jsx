import { Link } from 'react-router-dom'
import { Badge, Card, EmptyState, Loader } from '../components'
import { useNotifications } from '../hooks/useNotifications'
import { formatDate } from '../utils/applications'
import { isDemoSession } from '../utils/authStorage'
import { demoNotifications } from '../utils/demoData'
import { getDemoNotifications, getDemoWorkspace } from '../utils/demoWorkspace'

const tones = {
  'follow-up': 'warning',
  interview: 'info',
  overdue: 'danger',
  deadline: 'warning',
}

function NotificationsPage() {
  const { data: notifications = [], isLoading, error } = useNotifications()
  const isDemo = isDemoSession()
  const visibleNotifications = isDemo ? getDemoNotifications(getDemoWorkspace()) : notifications.length ? notifications : demoNotifications

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Notifications</h2>
        <p className="mt-1 text-sm text-slate-500">Smart reminders for follow-ups, interviews, deadlines, and overdue applications.</p>
      </div>

      {isLoading ? (
        <Loader label="Loading notifications" />
      ) : error ? (
        <EmptyState title="Could not load notifications" message="Try refreshing the page." />
      ) : visibleNotifications.length > 0 ? (
        <Card className="divide-y divide-slate-100">
          {visibleNotifications.map((notification) => (
            <Link key={notification.id} to={notification.href} className="block p-5 transition hover:bg-slate-50">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-950">{notification.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                  <p className="mt-2 text-sm text-slate-500">{formatDate(notification.dueDate)}</p>
                </div>
                <div className="flex gap-2">
                  {isDemo && <Badge tone="info">Demo</Badge>}
                  <Badge tone={tones[notification.type] || 'info'}>{notification.type}</Badge>
                </div>
              </div>
            </Link>
          ))}
        </Card>
      ) : (
        <EmptyState title="No notifications" message="You are all caught up right now." />
      )}
    </div>
  )
}

export default NotificationsPage

