const sendError = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  })
}

module.exports = {
  sendError,
}
