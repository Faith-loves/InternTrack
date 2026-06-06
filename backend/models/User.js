const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    preferredRole: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    portfolioLink: {
      type: String,
      trim: true,
      default: '',
    },
    linkedinLink: {
      type: String,
      trim: true,
      default: '',
    },
    githubLink: {
      type: String,
      trim: true,
      default: '',
    },
    refreshTokenHash: {
      type: String,
      default: '',
    },
    refreshTokenExpiresAt: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationTokenHash: {
      type: String,
      default: '',
    },
    emailVerificationExpiresAt: {
      type: Date,
    },
    passwordResetTokenHash: {
      type: String,
      default: '',
    },
    passwordResetExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.index({ refreshTokenHash: 1 })
userSchema.index({ emailVerificationTokenHash: 1 })
userSchema.index({ passwordResetTokenHash: 1 })

module.exports = mongoose.model('User', userSchema)
