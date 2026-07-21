import { APPLICATION_STATUSES } from './statuses'
import { demoApplications, demoDocuments, demoInterviews } from './demoData'

const DEMO_WORKSPACE_KEY = 'interntrackDemoWorkspace'

const demoCompanies = [
  {
    _id: 'demo-company-cwg',
    companyName: 'CWG',
    industry: 'Enterprise technology',
    website: 'https://cwg.example',
    location: 'Lagos, Nigeria',
    email: 'careers@cwg.example',
    phone: '+234 800 100 2000',
    linkedin: 'https://linkedin.com/company/cwg-demo',
    notes: 'Recruiter is reviewing UI/UX portfolio and accessibility case study.',
    createdAt: '2026-06-05T09:30:00.000Z',
  },
  {
    _id: 'demo-company-fiberone',
    companyName: 'FiberOne',
    industry: 'Telecommunications',
    website: 'https://fiberone.example',
    location: 'Hybrid, Lagos',
    email: 'talent@fiberone.example',
    phone: '+234 800 300 4000',
    linkedin: 'https://linkedin.com/company/fiberone-demo',
    notes: 'Follow up about frontend internship timeline and HR screening.',
    createdAt: '2026-06-04T10:30:00.000Z',
  },
  {
    _id: 'demo-company-andela',
    companyName: 'Andela',
    industry: 'Talent network',
    website: 'https://andela.example',
    location: 'Remote',
    email: 'grace.musa@andela.example',
    phone: '',
    linkedin: 'https://linkedin.com/company/andela-demo',
    notes: 'Assessment stage. Prepare React and API discussion notes.',
    createdAt: '2026-06-03T13:45:00.000Z',
  },
]

const defaultUser = {
  id: 'demo-recruiter',
  fullName: 'Recruiter Demo',
  email: 'demo@interntrack.com',
  preferredRole: 'Frontend Intern',
  location: 'Lagos, Nigeria',
  portfolioLink: '',
  linkedinLink: '',
  githubLink: '',
  isEmailVerified: true,
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function initialWorkspace() {
  return {
    user: defaultUser,
    applications: clone(demoApplications),
    interviews: clone(demoInterviews),
    documents: clone(demoDocuments),
    companies: clone(demoCompanies),
  }
}

function normalizeWorkspace(workspace) {
  const fallback = initialWorkspace()
  return {
    user: { ...fallback.user, ...(workspace?.user || {}) },
    applications: Array.isArray(workspace?.applications) ? workspace.applications : fallback.applications,
    interviews: Array.isArray(workspace?.interviews) ? workspace.interviews : fallback.interviews,
    documents: Array.isArray(workspace?.documents) ? workspace.documents : fallback.documents,
    companies: Array.isArray(workspace?.companies) ? workspace.companies : fallback.companies,
  }
}

export function getDemoWorkspace() {
  const stored = localStorage.getItem(DEMO_WORKSPACE_KEY)
  if (!stored) {
    const workspace = initialWorkspace()
    saveDemoWorkspace(workspace)
    return workspace
  }

  try {
    return normalizeWorkspace(JSON.parse(stored))
  } catch {
    const workspace = initialWorkspace()
    saveDemoWorkspace(workspace)
    return workspace
  }
}

export function saveDemoWorkspace(workspace) {
  localStorage.setItem(DEMO_WORKSPACE_KEY, JSON.stringify(normalizeWorkspace(workspace)))
}

export function resetDemoWorkspace() {
  const workspace = initialWorkspace()
  saveDemoWorkspace(workspace)
  return workspace
}

export function updateDemoWorkspace(updater) {
  const current = getDemoWorkspace()
  const next = normalizeWorkspace(updater(clone(current)))
  saveDemoWorkspace(next)
  return next
}

export function createDemoCompany(payload) {
  return updateDemoWorkspace((workspace) => {
    workspace.companies.unshift({ ...payload, _id: uid('demo-company'), createdAt: new Date().toISOString() })
    return workspace
  })
}

export function createDemoApplication(payload) {
  let created
  const workspace = updateDemoWorkspace((draft) => {
    created = { ...payload, _id: uid('demo-application'), createdAt: new Date().toISOString() }
    draft.applications.unshift(created)

    if (!draft.companies.some((company) => company.companyName.toLowerCase() === created.companyName.toLowerCase())) {
      draft.companies.unshift({
        _id: uid('demo-company'),
        companyName: created.companyName,
        industry: '',
        website: '',
        location: created.location || '',
        email: created.recruiterEmail || '',
        phone: '',
        linkedin: '',
        notes: created.notes || '',
        createdAt: new Date().toISOString(),
      })
    }

    return draft
  })

  return { workspace, application: created }
}

export function updateDemoApplication(id, updates) {
  let updated = null
  const workspace = updateDemoWorkspace((draft) => {
    draft.applications = draft.applications.map((application) => {
      if (application._id !== id) return application
      updated = { ...application, ...updates, updatedAt: new Date().toISOString() }
      return updated
    })
    return draft
  })

  return { workspace, application: updated }
}

export function deleteDemoApplication(id) {
  return updateDemoWorkspace((workspace) => {
    workspace.applications = workspace.applications.filter((application) => application._id !== id)
    workspace.interviews = workspace.interviews.filter((interview) => interview.applicationId !== id)
    return workspace
  })
}

export function createDemoInterview(payload) {
  return updateDemoWorkspace((workspace) => {
    workspace.interviews.unshift({ ...payload, _id: uid('demo-interview'), createdAt: new Date().toISOString() })
    return workspace
  })
}

export function updateDemoInterview(id, updates) {
  return updateDemoWorkspace((workspace) => {
    workspace.interviews = workspace.interviews.map((interview) => (
      interview._id === id ? { ...interview, ...updates, updatedAt: new Date().toISOString() } : interview
    ))
    return workspace
  })
}

export function createDemoDocument(payload) {
  return updateDemoWorkspace((workspace) => {
    workspace.documents.unshift({
      ...payload,
      _id: uid('demo-document'),
      uploadedAt: new Date().toISOString(),
      usedCount: workspace.applications.filter((application) => application.cvUsed === payload.fileName).length,
      versionHistory: [{ version: 1 }],
    })
    return workspace
  })
}

export function deleteDemoDocument(id) {
  return updateDemoWorkspace((workspace) => {
    workspace.documents = workspace.documents.filter((document) => document._id !== id)
    return workspace
  })
}

export function updateDemoUser(user) {
  return updateDemoWorkspace((workspace) => {
    workspace.user = { ...workspace.user, ...user }
    return workspace
  })
}

export function getDemoFollowUps(applications = getDemoWorkspace().applications) {
  const followUpStatuses = [
    APPLICATION_STATUSES.PENDING,
    APPLICATION_STATUSES.APPLIED,
    APPLICATION_STATUSES.ASSESSMENT,
    APPLICATION_STATUSES.INTERVIEW,
  ]

  return applications
    .filter((application) => application.followUpDate && followUpStatuses.includes(application.status))
    .map((application) => ({
      _id: `${application._id}-follow-up`,
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      followUpDate: application.followUpDate,
      message: `${application.companyName} - ${application.jobTitle} needs a recruiter follow-up.`,
    }))
}

export function getDemoNotifications(workspace = getDemoWorkspace()) {
  return [
    ...getDemoFollowUps(workspace.applications).map((application) => ({
      id: `demo-notification-${application._id}`,
      type: 'follow-up',
      title: `Follow up with ${application.companyName}`,
      message: application.message,
      dueDate: application.followUpDate,
      href: '/applications',
    })),
    ...workspace.interviews.map((interview) => ({
      id: `demo-notification-${interview._id}`,
      type: 'interview',
      title: `${interview.companyName} interview`,
      message: `${interview.interviewType || 'Interview'} for ${interview.jobTitle} is scheduled for ${interview.time || 'time not set'}.`,
      dueDate: interview.date,
      href: '/interviews',
    })),
  ]
}

export function getDemoAnalytics(workspace = getDemoWorkspace()) {
  const applications = workspace.applications
  const interviews = workspace.interviews
  const totalApplications = applications.length
  const countStatus = (status) => applications.filter((application) => application.status === status).length
  const responseCount = applications.filter((application) => [
    APPLICATION_STATUSES.INTERVIEW,
    APPLICATION_STATUSES.OFFER,
    APPLICATION_STATUSES.REJECTED,
  ].includes(application.status)).length

  const statusBreakdown = Object.values(APPLICATION_STATUSES).reduce((result, status) => {
    result[status] = countStatus(status)
    return result
  }, {})

  const monthCounts = applications.reduce((result, application) => {
    const date = application.dateApplied || application.createdAt
    const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(date))
    result[month] = (result[month] || 0) + 1
    return result
  }, {})

  const cvStats = workspace.documents.map((document) => {
    const matching = applications.filter((application) => application.cvUsed === document.fileName)
    const responses = matching.filter((application) => [
      APPLICATION_STATUSES.INTERVIEW,
      APPLICATION_STATUSES.OFFER,
      APPLICATION_STATUSES.REJECTED,
    ].includes(application.status)).length
    return {
      cv: document.fileName,
      applications: matching.length,
      responseRate: matching.length ? Math.round((responses / matching.length) * 100) : 0,
    }
  })

  const companyResponseRankings = [...new Set(applications.map((application) => application.companyName))].map((company) => {
    const matching = applications.filter((application) => application.companyName === company)
    const responses = matching.filter((application) => [
      APPLICATION_STATUSES.INTERVIEW,
      APPLICATION_STATUSES.OFFER,
      APPLICATION_STATUSES.REJECTED,
    ].includes(application.status)).length
    return {
      company,
      responses,
      responseRate: matching.length ? Math.round((responses / matching.length) * 100) : 0,
    }
  })

  return {
    totalApplications,
    pending: countStatus(APPLICATION_STATUSES.PENDING),
    interviews: interviews.length,
    offers: countStatus(APPLICATION_STATUSES.OFFER),
    rejections: countStatus(APPLICATION_STATUSES.REJECTED),
    ghosted: countStatus(APPLICATION_STATUSES.GHOSTED),
    followUpsDue: getDemoFollowUps(applications).length,
    responseRate: totalApplications ? Math.round((responseCount / totalApplications) * 100) : 0,
    offerRate: totalApplications ? Math.round((countStatus(APPLICATION_STATUSES.OFFER) / totalApplications) * 100) : 0,
    interviewConversionRate: totalApplications ? Math.round((interviews.length / totalApplications) * 100) : 0,
    statusBreakdown,
    monthlyApplications: Object.entries(monthCounts).map(([month, count]) => ({ month, count })),
    bestPerformingCVs: cvStats,
    companyResponseRankings,
  }
}

