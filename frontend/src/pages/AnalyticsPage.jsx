import { useEffect, useState } from 'react'
import { Card, EmptyState, Loader } from '../components'
import { analyticsService } from '../services/analyticsService'
import { getApiErrorMessage } from '../services/api'
import { getStatusLabel, statusOptions } from '../utils/applications'
import { isDemoSession } from '../utils/authStorage'
import { getDemoAnalytics, getDemoWorkspace } from '../utils/demoWorkspace'
const emptyAnalytics = {
  totalApplications: 0,
  interviews: 0,
  offers: 0,
  rejections: 0,
  responseRate: 0,
  offerRate: 0,
  interviewConversionRate: 0,
  statusBreakdown: {},
  monthlyApplications: [],
  bestPerformingCVs: [],
  companyResponseRankings: [],
}

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDemo, setIsDemo] = useState(() => isDemoSession())

  useEffect(() => {
    async function fetchAnalytics() {
      if (isDemoSession()) {
        setIsDemo(true)
        setAnalytics(getDemoAnalytics(getDemoWorkspace()))
        setLoading(false)
        return
      }

      try {
        const { data } = await analyticsService.get()
        setAnalytics(data)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load analytics'))
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) return <Loader label="Loading analytics" />
  if (error) return <EmptyState title="Could not load analytics" message={error} />

  const visibleAnalytics = analytics || emptyAnalytics
  const totalApplications = visibleAnalytics.totalApplications || 0
  const pipelineRows = statusOptions.map((option) => {
    const count = visibleAnalytics.statusBreakdown?.[option.value] || 0
    const width = totalApplications ? `${Math.round((count / totalApplications) * 100)}%` : '0%'

    return [getStatusLabel(option.value), width, count]
  })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">Understand your application progress and response rate.</p>
      </div>

      {isDemo && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">Demo analytics are showing so recruiters can review a populated workspace.</p>
          <p className="mt-1 text-sm text-emerald-700">Applications, interviews, CV usage, and response metrics are synchronized with the recruiter demo data.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {[
          ['Total applications', visibleAnalytics.totalApplications || 0, isDemo ? 'Saved in demo workspace' : 'Saved in MongoDB'],
          ['Interviews', visibleAnalytics.interviews || 0, 'Interview records'],
          ['Offers', visibleAnalytics.offers || 0, 'Applications marked offer'],
          ['Rejections', visibleAnalytics.rejections || 0, 'Applications marked rejected'],
          ['Response rate', `${visibleAnalytics.responseRate || 0}%`, 'Interview, offer, or rejection'],
          ['Offer rate', `${visibleAnalytics.offerRate || 0}%`, 'Offer outcomes'],
          ['Interview conversion', `${visibleAnalytics.interviewConversionRate || 0}%`, 'Interview records per application'],
        ].map(([label, value, note]) => (
          <Card key={label} className="p-5">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{note}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-slate-950">Pipeline overview</h3>
        <div className="mt-5 grid gap-3">
          {pipelineRows.map(([label, width, count]) => (
            <div key={label}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="text-slate-500">{count} - {width}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-emerald-500" style={{ width }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-950">Monthly applications</h3>
          <div className="mt-5 space-y-3">
            {(visibleAnalytics.monthlyApplications || []).map((item) => (
              <div key={item.month}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.month}</span>
                  <span className="text-slate-500">{item.count}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-sky-500" style={{ width: `${Math.min(item.count * 20, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-950">Best-performing CVs</h3>
          <div className="mt-5 space-y-3">
            {(visibleAnalytics.bestPerformingCVs || []).slice(0, 5).map((item) => (
              <div key={item.cv} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-950">{item.cv}</p>
                <p className="mt-1 text-sm text-slate-500">{item.responseRate}% response rate - {item.applications} applications</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-950">Company response rankings</h3>
          <div className="mt-5 space-y-3">
            {(visibleAnalytics.companyResponseRankings || []).slice(0, 5).map((item) => (
              <div key={item.company} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-950">{item.company}</p>
                <p className="mt-1 text-sm text-slate-500">{item.responseRate}% response rate - {item.responses} responses</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsPage





