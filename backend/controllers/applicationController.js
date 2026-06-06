const Application = require('../models/Application')
const { sendError } = require('../utils/errorResponse')

const buildStatusHistoryEntry = (status) => ({
  status,
  changedAt: new Date(),
})

const createApplication = async (req, res) => {
  try {
    const status = req.body.status || 'pending'
    const application = await Application.create({
      ...req.body,
      status,
      statusHistory: [buildStatusHistoryEntry(status)],
      userId: req.user._id,
    })

    return res.status(201).json(application)
  } catch (error) {
    return sendError(res, 500, 'Failed to create application', [{ message: error.message }])
  }
}

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id }).sort({ createdAt: -1 })
    return res.status(200).json(applications)
  } catch (error) {
    return sendError(res, 500, 'Failed to get applications', [{ message: error.message }])
  }
}

const getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, userId: req.user._id })

    if (!application) {
      return sendError(res, 404, 'Application not found')
    }

    return res.status(200).json(application)
  } catch (error) {
    return sendError(res, 500, 'Failed to get application', [{ message: error.message }])
  }
}

const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, userId: req.user._id })

    if (!application) {
      return sendError(res, 404, 'Application not found')
    }

    const previousStatus = application.status
    Object.assign(application, req.body)

    if (req.body.status && req.body.status !== previousStatus) {
      application.statusHistory.push(buildStatusHistoryEntry(req.body.status))
    }

    await application.save()

    return res.status(200).json(application)
  } catch (error) {
    return sendError(res, 500, 'Failed to update application', [{ message: error.message }])
  }
}

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, userId: req.user._id })

    if (!application) {
      return sendError(res, 404, 'Application not found')
    }

    return res.status(200).json({ success: true, message: 'Application deleted' })
  } catch (error) {
    return sendError(res, 500, 'Failed to delete application', [{ message: error.message }])
  }
}

module.exports = {
  createApplication,
  deleteApplication,
  getApplication,
  getApplications,
  updateApplication,
}
