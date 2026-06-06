const { validationResult } = require('express-validator')
const { sendError } = require('../utils/errorResponse')

const validateRequest = (req, res, next) => {
  const result = validationResult(req)

  if (result.isEmpty()) {
    return next()
  }

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }))

  return sendError(res, 400, errors[0]?.message || 'Validation failed', errors)
}

module.exports = validateRequest
