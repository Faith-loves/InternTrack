const Application = require('../models/Application')
const Interview = require('../models/Interview')
const Document = require('../models/Document')
const Company = require('../models/Company')
const { APPLICATION_STATUS } = require('../utils/constants')
const { sendError } = require('../utils/errorResponse')

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id
    const applications = await Application.find({ userId })
    const totalApplications = applications.length
    const interviews = await Interview.countDocuments({ userId })
    const documents = await Document.countDocuments({ userId })
    const companies = await Company.countDocuments({ userId })
    const offers = applications.filter((application) => application.status === APPLICATION_STATUS.OFFER).length
    const rejections = applications.filter((application) => application.status === APPLICATION_STATUS.REJECTED).length
    const pending = applications.filter((application) => application.status === APPLICATION_STATUS.PENDING).length
    const ghosted = applications.filter((application) => application.status === APPLICATION_STATUS.GHOSTED).length
    const assessments = applications.filter((application) => application.status === APPLICATION_STATUS.ASSESSMENT).length
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const followUpsDue = applications.filter((application) => {
      if (!application.followUpDate || [APPLICATION_STATUS.OFFER, APPLICATION_STATUS.REJECTED].includes(application.status)) {
        return false
      }

      const followUpDate = new Date(application.followUpDate)
      followUpDate.setHours(0, 0, 0, 0)
      return followUpDate <= today
    }).length
    const responseCount = applications.filter((application) =>
      [APPLICATION_STATUS.ASSESSMENT, APPLICATION_STATUS.INTERVIEW, APPLICATION_STATUS.OFFER, APPLICATION_STATUS.REJECTED].includes(application.status),
    ).length
    const responseRate = totalApplications ? Math.round((responseCount / totalApplications) * 100) : 0
    const offerRate = totalApplications ? Math.round((offers / totalApplications) * 100) : 0
    const interviewConversionRate = totalApplications ? Math.round((interviews / totalApplications) * 100) : 0
    const monthlyApplications = applications.reduce((months, application) => {
      const date = application.dateApplied || application.createdAt
      const key = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date)
      months[key] = (months[key] || 0) + 1
      return months
    }, {})
    const cvStats = applications.reduce((stats, application) => {
      const cv = application.cvUsed || 'Not set'
      stats[cv] = stats[cv] || { cv, applications: 0, responses: 0, offers: 0 }
      stats[cv].applications += 1
      if ([APPLICATION_STATUS.ASSESSMENT, APPLICATION_STATUS.INTERVIEW, APPLICATION_STATUS.OFFER, APPLICATION_STATUS.REJECTED].includes(application.status)) {
        stats[cv].responses += 1
      }
      if (application.status === APPLICATION_STATUS.OFFER) {
        stats[cv].offers += 1
      }
      return stats
    }, {})
    const companyRankings = applications.reduce((rankings, application) => {
      const company = application.companyName
      rankings[company] = rankings[company] || { company, applications: 0, responses: 0 }
      rankings[company].applications += 1
      if ([APPLICATION_STATUS.ASSESSMENT, APPLICATION_STATUS.INTERVIEW, APPLICATION_STATUS.OFFER, APPLICATION_STATUS.REJECTED].includes(application.status)) {
        rankings[company].responses += 1
      }
      return rankings
    }, {})

    return res.status(200).json({
      totalApplications,
      pending,
      interviews,
      offers,
      rejections,
      ghosted,
      responseRate,
      offerRate,
      interviewConversionRate,
      followUpsDue,
      documents,
      companies,
      monthlyApplications: Object.entries(monthlyApplications).map(([month, count]) => ({ month, count })),
      bestPerformingCVs: Object.values(cvStats)
        .map((item) => ({
          ...item,
          responseRate: item.applications ? Math.round((item.responses / item.applications) * 100) : 0,
        }))
        .sort((a, b) => b.responseRate - a.responseRate),
      companyResponseRankings: Object.values(companyRankings)
        .map((item) => ({
          ...item,
          responseRate: item.applications ? Math.round((item.responses / item.applications) * 100) : 0,
        }))
        .sort((a, b) => b.responseRate - a.responseRate),
      statusBreakdown: {
        pending,
        applied: applications.filter((application) => application.status === APPLICATION_STATUS.APPLIED).length,
        assessment: assessments,
        interview: applications.filter((application) => application.status === APPLICATION_STATUS.INTERVIEW).length,
        offer: offers,
        rejected: rejections,
        ghosted,
      },
    })
  } catch (error) {
    return sendError(res, 500, 'Failed to get analytics', [{ message: error.message }])
  }
}

module.exports = {
  getAnalytics,
}
