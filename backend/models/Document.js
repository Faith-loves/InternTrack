const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
      default: '',
    },
    cvType: {
      type: String,
      trim: true,
      default: '',
    },
    documentType: {
      type: String,
      enum: ['CV', 'Cover letter', 'Portfolio', 'Certificate', 'Other'],
      default: 'CV',
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
      default: '',
    },
    linkedApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    versionHistory: [
      {
        fileName: String,
        fileUrl: String,
        cloudinaryPublicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

documentSchema.index({ userId: 1 })
documentSchema.index({ uploadedAt: -1 })

module.exports = mongoose.model('Document', documentSchema)
