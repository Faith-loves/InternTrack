const mongoose = require('mongoose')
const { APPLICATION_STATUSES } = require('../utils/constants')

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    applicationLink: {
      type: String,
      trim: true,
      default: '',
    },
    dateApplied: {
      type: Date,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'pending',
    },
    recruiterName: {
      type: String,
      trim: true,
      default: '',
    },
    recruiterEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    cvUsed: {
      type: String,
      trim: true,
      default: '',
    },
    coverLetterUsed: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    followUpDate: {
      type: Date,
    },
    applicationDeadline: {
      type: Date,
    },
    jobPostingArchive: {
      type: String,
      trim: true,
      default: '',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
    },
    salaryCurrency: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'USD',
    },
    applicationSource: {
      type: String,
      trim: true,
      default: '',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: APPLICATION_STATUSES,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

applicationSchema.index({ companyName: 1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ userId: 1 })
applicationSchema.index({ dateApplied: -1 })
applicationSchema.index({ applicationDeadline: 1 })

module.exports = mongoose.model('Application', applicationSchema)
