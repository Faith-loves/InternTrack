const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Application = require('../models/Application')
const Company = require('../models/Company')
const Document = require('../models/Document')
const Interview = require('../models/Interview')
const { sendError } = require('../utils/errorResponse')

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  })
}

const hashRefreshToken = (token) => crypto.createHash('sha256').update(token).digest('hex')
const hashToken = hashRefreshToken

const createPlainToken = () => crypto.randomBytes(32).toString('hex')

const createRefreshToken = async (user) => {
  const refreshToken = crypto.randomBytes(64).toString('hex')
  user.refreshTokenHash = hashRefreshToken(refreshToken)
  user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await user.save()
  return refreshToken
}

const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  preferredRole: user.preferredRole,
  location: user.location,
  portfolioLink: user.portfolioLink,
  linkedinLink: user.linkedinLink,
  githubLink: user.githubLink,
  isEmailVerified: user.isEmailVerified,
})

const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      preferredRole = '',
      location = '',
      portfolioLink = '',
      linkedinLink = '',
      githubLink = '',
    } = req.body

    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return sendError(res, 400, 'User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      preferredRole,
      location,
      portfolioLink,
      linkedinLink,
      githubLink,
    })
    const refreshToken = await createRefreshToken(user)

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      token: generateAccessToken(user._id),
      refreshToken,
      user: formatUser(user),
    })
  } catch (error) {
    return sendError(res, 500, 'Signup failed', [{ message: error.message }])
  }
}

const requestEmailVerification = async (req, res) => {
  try {
    const token = createPlainToken()
    req.user.emailVerificationTokenHash = hashToken(token)
    req.user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await req.user.save()

    return res.status(200).json({
      success: true,
      message: 'Email verification token generated',
      verificationToken: token,
    })
  } catch (error) {
    return sendError(res, 500, 'Failed to create verification token', [{ message: error.message }])
  }
}

const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerificationTokenHash: hashToken(req.body.token),
      emailVerificationExpiresAt: { $gt: new Date() },
    })

    if (!user) {
      return sendError(res, 400, 'Verification token is invalid or expired')
    }

    user.isEmailVerified = true
    user.emailVerificationTokenHash = ''
    user.emailVerificationExpiresAt = null
    await user.save()

    return res.status(200).json({ success: true, message: 'Email verified' })
  } catch (error) {
    return sendError(res, 500, 'Failed to verify email', [{ message: error.message }])
  }
}

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() })

    if (user) {
      const token = createPlainToken()
      user.passwordResetTokenHash = hashToken(token)
      user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000)
      await user.save()

      return res.status(200).json({
        success: true,
        message: 'Password reset token generated',
        resetToken: token,
      })
    }

    return res.status(200).json({ success: true, message: 'If the email exists, reset instructions were generated' })
  } catch (error) {
    return sendError(res, 500, 'Failed to request password reset', [{ message: error.message }])
  }
}

const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      passwordResetTokenHash: hashToken(req.body.token),
      passwordResetExpiresAt: { $gt: new Date() },
    })

    if (!user) {
      return sendError(res, 400, 'Reset token is invalid or expired')
    }

    user.password = await bcrypt.hash(req.body.password, 10)
    user.passwordResetTokenHash = ''
    user.passwordResetExpiresAt = null
    user.refreshTokenHash = ''
    user.refreshTokenExpiresAt = null
    await user.save()

    return res.status(200).json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    return sendError(res, 500, 'Failed to reset password', [{ message: error.message }])
  }
}

const deleteAccount = async (req, res) => {
  try {
    await Promise.all([
      Application.deleteMany({ userId: req.user._id }),
      Company.deleteMany({ userId: req.user._id }),
      Document.deleteMany({ userId: req.user._id }),
      Interview.deleteMany({ userId: req.user._id }),
      User.findByIdAndDelete(req.user._id),
    ])
    return res.status(200).json({ success: true, message: 'Account deleted' })
  } catch (error) {
    return sendError(res, 500, 'Failed to delete account', [{ message: error.message }])
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return sendError(res, 400, 'Invalid email or password')
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return sendError(res, 400, 'Invalid email or password')
    }
    const refreshToken = await createRefreshToken(user)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateAccessToken(user._id),
      refreshToken,
      user: formatUser(user),
    })
  } catch (error) {
    return sendError(res, 500, 'Login failed', [{ message: error.message }])
  }
}

const refreshSession = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const user = await User.findOne({
      refreshTokenHash: hashRefreshToken(refreshToken),
      refreshTokenExpiresAt: { $gt: new Date() },
    })

    if (!user) {
      return sendError(res, 401, 'Refresh session expired')
    }

    const nextRefreshToken = await createRefreshToken(user)

    return res.status(200).json({
      success: true,
      message: 'Session refreshed',
      token: generateAccessToken(user._id),
      refreshToken: nextRefreshToken,
      user: formatUser(user),
    })
  } catch (error) {
    return sendError(res, 500, 'Failed to refresh session', [{ message: error.message }])
  }
}

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshTokenHash: hashRefreshToken(refreshToken) },
        { refreshTokenHash: '', refreshTokenExpiresAt: null },
      )
    }

    return res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    return sendError(res, 500, 'Logout failed', [{ message: error.message }])
  }
}

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: formatUser(req.user),
  })
}

const updateCurrentUser = async (req, res) => {
  try {
    const allowedUpdates = [
      'fullName',
      'email',
      'preferredRole',
      'location',
      'portfolioLink',
      'linkedinLink',
      'githubLink',
    ]
    const updates = {}

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    if (updates.email) {
      updates.email = updates.email.toLowerCase()
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password')

    return res.status(200).json({ success: true, user: formatUser(user) })
  } catch (error) {
    return sendError(res, 500, 'Failed to update user', [{ message: error.message }])
  }
}

module.exports = {
  getCurrentUser,
  deleteAccount,
  forgotPassword,
  login,
  logout,
  refreshSession,
  requestEmailVerification,
  resetPassword,
  signup,
  updateCurrentUser,
  verifyEmail,
}
