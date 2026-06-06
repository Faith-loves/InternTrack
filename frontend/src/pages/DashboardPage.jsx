import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  DashboardSkeleton,
  EmptyState,
  Table,
} from '../components'
import { analyticsService } from '../services/analyticsService'
import { applicationService } from '../services/applicationService'
import { getApiErrorMessage } from '../services/api'
import { documentService } from '../services/documentService'
import { interviewService } from '../services/interviewService'
import { getStoredUser } from '../utils/authStorage'
import {
  APPLICATION_STATUSES,
  formatDate,
  getPlainDate,
  getStatusLabel,
  getStatusTone,
  isThisWeek,
  isToday,
} from '../utils/applications'
import { demoAnalytics, demoApplications, demoDocuments, demoInterviews } from '../utils/demoData'

function DashboardPage() {
  const [analytics, setAnalytics] = useState(null)
  const [applications, setApplications] = useState([])
  const [documents, setDocuments] = useState([])
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(() => getStoredUser())

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [analyticsResponse, applicationsResponse, interviewsResponse, documentsResponse] = await Promise.all([
          analyticsService.get(),
          applicationService.getAll(),
          interviewService.getAll(),
          documentService.getAll(),
        ])
        setAnalytics(analyticsResponse.data)
        setApplications(applicationsResponse.data)
        setInterviews(interviewsResponse.data)
        setDocuments(documentsResponse.data)
        setUser(getStoredUser())
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load dashboard'))
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) return <DashboardSkeleton />
  if (error) return <EmptyState title="Could not load dashboard" message={error} />

  const hasApplications = applications.length > 0
  const hasInterviews = interviews.length > 0
  const hasDocuments = documents.length > 0
  const visibleApplications = hasApplications ? applications : demoApplications
  const visibleInterviews = hasInterviews ? interviews : demoInterviews
  const visibleDocuments = hasDocuments ? documents : demoDocuments

  const today = getPlainDate(new Date())
  const reminders = applications.filter((application) => {
    if (application.followUpDate) {
      const followUpDate = getPlainDate(application.followUpDate)
      if (
        followUpDate <= today &&
        ![APPLICATION_STATUSES.OFFER, APPLICATION_STATUSES.REJECTED].includes(application.status)
      ) return true
    }

    if (application.status === APPLICATION_STATUSES.APPLIED && application.dateApplied) {
      const appliedDate = getPlainDate(application.dateApplied)
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)
      return appliedDate <= sevenDaysAgo
    }

    return false
  })

  const visibleReminders = reminders.length
    ? reminders
    : [
        {
          _id: 'demo-reminder-fiberone',
          companyName: 'FiberOne',
          jobTitle: 'Frontend Intern',
          message: 'You applied to FiberOne 7 days ago. Send a follow-up.',
        },
      ]

  const upcomingInterviews = interviews.filter((interview) => isToday(interview.date) || isThisWeek(interview.date))
  const interviewsToShow = upcomingInterviews.length ? upcomingInterviews : visibleInterviews

  const totalApplications = hasApplications ? applications.length : demoAnalytics.totalApplications
  const interviewsScheduled = hasInterviews ? interviews.length : demoAnalytics.interviews
  const offersReceived = hasApplications
    ? applications.filter((application) => application.status === APPLICATION_STATUSES.OFFER).length
    : demoAnalytics.offers
  const followUpsDue = hasApplications ? reminders.length : demoAnalytics.followUpsDue

  const statCards = [
    ['Total Applications', totalApplications, 'bg-emerald-50 text-emerald-700 border-emerald-100'],
    ['Interviews Scheduled', interviewsScheduled, 'bg-sky-50 text-sky-700 border-sky-100'],
    ['Offers Received', offersReceived, 'bg-violet-50 text-violet-700 border-violet-100'],
    ['Follow-ups Due', followUpsDue, 'bg-amber-50 text-amber-700 border-amber-100'],
  ]

  const statusColumns = [
    ['Saved', APPLICATION_STATUSES.PENDING],
    ['Applied', APPLICATION_STATUSES.APPLIED],
    ['Assessment', APPLICATION_STATUSES.ASSESSMENT],
    ['Interview', APPLICATION_STATUSES.INTERVIEW],
    ['Offer', APPLICATION_STATUSES.OFFER],
    ['Rejected', APPLICATION_STATUSES.REJECTED],
  ]

  const responseRate = hasApplications ? analytics?.responseRate || 0 : demoAnalytics.responseRate
  const offerRate = hasApplications ? analytics?.offerRate || 0 : demoAnalytics.offerRate
  const interviewRate = hasApplications ? analytics?.interviewConversionRate || 0 : demoAnalytics.interviewConversionRate

  const quickActions = [
    ['Add Application', 'Save a new role, recruiter, date, and status.', '/applications/add', 'bg-emerald-500'],
    ['Schedule Interview', 'Add date, time, type, and preparation notes.', '/interviews', 'bg-sky-500'],
    ['Upload CV', 'Keep CV versions ready for each opportunity.', '/documents', 'bg-violet-500'],
    ['Create Follow-up', 'Generate the next message for active roles.', '/applications', 'bg-amber-500'],
  ]

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#ecfdf5_0%,#eff6ff_55%,#fff7ed_100%)] p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">Welcome back{user?.fullName ? `, ${user.fullName}` : ''}</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              Track every job and internship application in one dashboard.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage applications, interviews, CVs, recruiter contacts, follow-ups, and progress analytics without losing track.
            </p>
          </div>
          <Link to="/applications/add" className="shrink-0">
            <Button className="w-full bg-emerald-600 text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-700 sm:w-auto">
              Add Application
            </Button>
          </Link>
        </div>
      </section>

      {!hasApplications && (
        <Card className="border-emerald-100 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">No applications yet. Add your first application to start tracking.</h2>
              <p className="mt-1 text-sm text-slate-500">The dashboard below shows sample data so you can see how InternTrack will look once you begin.</p>
            </div>
            <Link to="/applications/add">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">Add first application</Button>
            </Link>
          </div>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, value, className]) => (
          <Card key={label} className={`border p-5 shadow-sm ${className}`}>
            <p className="text-sm font-bold">{label}</p>
            <p className="mt-3 text-4xl font-black text-slate-950">{value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">Recent applications</h2>
              <p className="mt-1 text-sm text-slate-500">Your newest opportunities and current statuses.</p>
            </div>
            {!hasApplications && <Badge tone="info">Sample preview</Badge>}
          </div>
          <Table
            columns={['Company', 'Role', 'Status', 'Follow-up', 'Action']}
            rows={visibleApplications.slice(0, 5)}
            renderRow={(row) => (
              <tr key={row._id}>
                <td className="px-4 py-3 font-semibold text-slate-950">{row.companyName}</td>
                <td className="px-4 py-3">{row.jobTitle}</td>
                <td className="px-4 py-3">
                  <Badge tone={getStatusTone(row.status)}>{getStatusLabel(row.status)}</Badge>
                </td>
                <td className="px-4 py-3">{formatDate(row.followUpDate)}</td>
                <td className="px-4 py-3">
                  {hasApplications ? (
                    <Link className="font-semibold text-emerald-700" to={`/applications/${row._id}`}>
                      View
                    </Link>
                  ) : (
                    <span className="text-slate-400">Preview</span>
                  )}
                </td>
              </tr>
            )}
          />
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-black text-slate-950">Quick actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map(([title, body, path, color]) => (
              <Link key={title} to={path} className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color} text-sm font-black text-white`}>
                  {title.slice(0, 1)}
                </div>
                <h3 className="font-black text-slate-950">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">{body}</p>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-950">Application status board</h2>
            <p className="mt-1 text-sm text-slate-500">See where every application currently sits.</p>
          </div>
          {!hasApplications && <Badge tone="info">Sample board</Badge>}
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {statusColumns.map(([label, status]) => {
            const items = visibleApplications.filter((application) => application.status === status)
            return (
              <section key={label} className="min-h-40 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-slate-800">{label}</h3>
                  <Badge tone={items.length ? getStatusTone(status) : 'default'}>{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.length ? (
                    items.slice(0, 3).map((application) => (
                      <div key={application._id} className="rounded-lg border border-white bg-white p-3 shadow-sm">
                        <p className="text-sm font-bold text-slate-950">{application.companyName}</p>
                        <p className="mt-1 text-xs text-slate-500">{application.jobTitle}</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-xs leading-5 text-slate-500">
                      No applications yet.
                    </p>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">Upcoming interviews</h2>
            {!hasInterviews && <Badge tone="info">Sample</Badge>}
          </div>
          <div className="space-y-3">
            {interviewsToShow.length ? (
              interviewsToShow.slice(0, 4).map((interview) => (
                <div key={interview._id} className="rounded-xl border border-sky-100 bg-sky-50 p-4">
                  <p className="font-black text-slate-950">{formatDate(interview.date)}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{interview.companyName} - {interview.jobTitle}</p>
                  <p className="mt-1 text-sm text-slate-500">{interview.time || 'Time not set'} - {interview.interviewType || 'Interview'}</p>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No interviews yet. Schedule your first interview when a company replies.</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">Follow-up reminders</h2>
            <Badge tone={followUpsDue ? 'warning' : 'success'}>{followUpsDue}</Badge>
          </div>
          <div className="space-y-3">
            {visibleReminders.slice(0, 4).map((application) => (
              <div key={application._id} className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  {application.message || `${application.companyName} - ${application.jobTitle}`}
                </p>
                {!application.message && (
                  <p className="mt-1 text-sm text-slate-500">
                    {application.followUpDate
                      ? `Follow-up due ${formatDate(application.followUpDate)}`
                      : `Applied on ${formatDate(application.dateApplied)} and still marked Applied`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">CV manager preview</h2>
            {!hasDocuments && <Badge tone="info">Sample</Badge>}
          </div>
          <div className="space-y-3">
            {visibleDocuments.slice(0, 4).map((document) => (
              <div key={document._id} className="flex items-center justify-between gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4">
                <div>
                  <p className="font-black text-slate-950">{document.fileName}</p>
                  <p className="mt-1 text-sm text-slate-500">{document.cvType || 'CV'} - used {document.usedCount || 0} times</p>
                </div>
                <Badge tone="info">CV</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-950">Analytics preview</h2>
            <p className="mt-1 text-sm text-slate-500">A quick read on how your pipeline is performing.</p>
          </div>
          {!hasApplications && <Badge tone="info">Sample analytics</Badge>}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Response rate', responseRate, 'bg-emerald-500'],
            ['Offer rate', offerRate, 'bg-violet-500'],
            ['Interview rate', interviewRate, 'bg-sky-500'],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-600">{label}</p>
                  <p className="mt-2 text-4xl font-black text-slate-950">{value}%</p>
                </div>
                <div className="flex h-20 items-end gap-1.5">
                  {[42, 64, 54, Number(value) || 12].map((height, index) => (
                    <span
                      key={`${label}-${index}`}
                      className={`w-3 rounded-t-full ${color}`}
                      style={{ height: `${Math.max(14, height)}%`, opacity: 0.55 + index * 0.12 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default DashboardPage
