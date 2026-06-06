const Interview = require('../models/Interview')
const Application = require('../models/Application')
const { sendError } = require('../utils/errorResponse')

const createInterview = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.body.applicationId, userId: req.user._id })
    if (!application) {
      return sendError(res, 404, 'Application not found for this user')
    }

    const interview = await Interview.create({
      ...req.body,
      userId: req.user._id,
    })

    return res.status(201).json(interview)
  } catch (error) {
    return sendError(res, 500, 'Failed to create interview', [{ message: error.message }])
  }
}

const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id })
      .populate('applicationId')
      .sort({ date: 1, time: 1 })

    return res.status(200).json(interviews)
  } catch (error) {
    return sendError(res, 500, 'Failed to get interviews', [{ message: error.message }])
  }
}

const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id }).populate('applicationId')

    if (!interview) {
      return sendError(res, 404, 'Interview not found')
    }

    return res.status(200).json(interview)
  } catch (error) {
    return sendError(res, 500, 'Failed to get interview', [{ message: error.message }])
  }
}

const updateInterview = async (req, res) => {
  try {
    if (req.body.applicationId) {
      const application = await Application.findOne({ _id: req.body.applicationId, userId: req.user._id })
      if (!application) {
        return sendError(res, 404, 'Application not found for this user')
      }
    }

    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true },
    )

    if (!interview) {
      return sendError(res, 404, 'Interview not found')
    }

    return res.status(200).json(interview)
  } catch (error) {
    return sendError(res, 500, 'Failed to update interview', [{ message: error.message }])
  }
}

const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.user._id })

    if (!interview) {
      return sendError(res, 404, 'Interview not found')
    }

    return res.status(200).json({ success: true, message: 'Interview deleted' })
  } catch (error) {
    return sendError(res, 500, 'Failed to delete interview', [{ message: error.message }])
  }
}

module.exports = {
  createInterview,
  deleteInterview,
  getInterview,
  getInterviews,
  updateInterview,
}
