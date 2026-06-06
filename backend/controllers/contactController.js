const { sendError } = require('../utils/errorResponse')

const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body
    console.log(`Contact form submission from ${name} <${email}>: ${message}`)
    return res.status(201).json({ success: true, message: 'Message received' })
  } catch (error) {
    return sendError(res, 500, 'Failed to submit contact form', [{ message: error.message }])
  }
}

module.exports = {
  submitContact,
}
