const rateLimit = require('express-rate-limit')
const { sendError } = require('../utils/errorResponse')

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => sendError(res, 429, 'Too many auth attempts. Please try again later.'),
})

module.exports = {
  authRateLimiter,
}
