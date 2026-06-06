const express = require('express')
const {
  deleteAccount,
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  refreshSession,
  requestEmailVerification,
  resetPassword,
  signup,
  updateCurrentUser,
  verifyEmail,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const { authRateLimiter } = require('../middleware/rateLimitMiddleware')
const validateRequest = require('../middleware/validateRequest')
const {
  forgotPasswordRules,
  loginRules,
  profileRules,
  refreshTokenRules,
  resetPasswordRules,
  signupRules,
  tokenRules,
} = require('../middleware/validationRules')

const router = express.Router()

router.post('/signup', authRateLimiter, signupRules, validateRequest, signup)
router.post('/login', authRateLimiter, loginRules, validateRequest, login)
router.post('/refresh', refreshTokenRules, validateRequest, refreshSession)
router.post('/logout', refreshTokenRules, validateRequest, logout)
router.post('/forgot-password', authRateLimiter, forgotPasswordRules, validateRequest, forgotPassword)
router.post('/reset-password', authRateLimiter, resetPasswordRules, validateRequest, resetPassword)
router.post('/verify-email', tokenRules, validateRequest, verifyEmail)
router.get('/me', protect, getCurrentUser)
router.put('/me', protect, profileRules, validateRequest, updateCurrentUser)
router.post('/request-email-verification', protect, requestEmailVerification)
router.delete('/me', protect, deleteAccount)

module.exports = router
