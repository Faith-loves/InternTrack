const { sendError } = require('../utils/errorResponse')

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  const isUploadError = err.code === 'LIMIT_FILE_SIZE' || err.message?.includes('files are allowed')
  const statusCode = isUploadError ? 400 : res.statusCode === 200 ? 500 : res.statusCode
  const message = err.code === 'LIMIT_FILE_SIZE'
    ? 'File size must be 5MB or less'
    : err.message || 'Server error'

  const errors = process.env.NODE_ENV === 'production' ? [] : [{ message: err.stack }]
  return sendError(res, statusCode, message, errors)
}

module.exports = {
  errorHandler,
  notFound,
}
