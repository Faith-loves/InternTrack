const Application = require('../models/Application')
const Interview = require('../models/Interview')
const { APPLICATION_STATUS } = require('../utils/constants')
const { sendError } = require('../utils/errorResponse')

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekFromNow = new Date(today)
    weekFromNow.setDate(today.getDate() + 7)

    const [applications, interviews] = await Promise.all([
      Application.find({ userId }),
      Interview.find({ userId }).sort({ date: 1, time: 1 }),
    ])

    const notifications = []

    applications.forEach((application) => {
      if (application.followUpDate) {
        const followUpDate = new Date(application.followUpDate)
        followUpDate.setHours(0, 0, 0, 0)

        if (followUpDate <= today && ![APPLICATION_STATUS.OFFER, APPLICATION_STATUS.REJECTED].includes(application.status)) {
          notifications.push({
            id: `follow-up-${application._id}`,
            type: 'follow-up',
            title: 'Follow-up due',
            message: `${application.companyName} - ${application.jobTitle}`,
            dueDate: application.followUpDate,
            href: `/applications/${application._id}`,
          })
        }
      }

      if (application.applicationDeadline) {
        const deadline = new Date(application.applicationDeadline)
        deadline.setHours(0, 0, 0, 0)

        if (deadline <= weekFromNow && application.status !== APPLICATION_STATUS.REJECTED) {
          notifications.push({
            id: `deadline-${application._id}`,
            type: deadline < today ? 'overdue' : 'deadline',
            title: deadline < today ? 'Application deadline passed' : 'Application deadline soon',
            message: `${application.companyName} - ${application.jobTitle}`,
            dueDate: application.applicationDeadline,
            href: `/applications/${application._id}`,
          })
        }
      }

      if (application.status === APPLICATION_STATUS.APPLIED && application.dateApplied) {
        const appliedDate = new Date(application.dateApplied)
        appliedDate.setDate(appliedDate.getDate() + 7)
        if (appliedDate <= today) {
          notifications.push({
            id: `stale-${application._id}`,
            type: 'overdue',
            title: 'Application may need attention',
            message: `${application.companyName} is still marked Applied after 7 days`,
            dueDate: application.dateApplied,
            href: `/applications/${application._id}`,
          })
        }
      }
    })

    interviews.forEach((interview) => {
      const interviewDate = new Date(interview.date)
      interviewDate.setHours(0, 0, 0, 0)

      if (interviewDate >= today && interviewDate <= weekFromNow) {
        notifications.push({
          id: `interview-${interview._id}`,
          type: 'interview',
          title: interviewDate.getTime() === today.getTime() ? 'Interview today' : 'Interview this week',
          message: `${interview.companyName} - ${interview.jobTitle} at ${interview.time}`,
          dueDate: interview.date,
          href: '/interviews',
        })
      }
    })

    notifications.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0))

    return res.status(200).json(notifications)
  } catch (error) {
    return sendError(res, 500, 'Failed to get notifications', [{ message: error.message }])
  }
}

module.exports = {
  getNotifications,
}
