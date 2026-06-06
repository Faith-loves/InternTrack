const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
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
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    interviewType: {
      type: String,
      trim: true,
      default: '',
    },
    interviewLink: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    preparationNotes: {
      type: String,
      trim: true,
      default: '',
    },
    preparationChecklist: [
      {
        text: {
          type: String,
          trim: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    interviewNotes: {
      type: String,
      trim: true,
      default: '',
    },
    interviewFeedback: {
      type: String,
      trim: true,
      default: '',
    },
    outcome: {
      type: String,
      enum: ['scheduled', 'completed', 'passed', 'rejected', 'offer', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  },
)

interviewSchema.index({ userId: 1 })
interviewSchema.index({ date: 1 })
interviewSchema.index({ outcome: 1 })

module.exports = mongoose.model('Interview', interviewSchema)
