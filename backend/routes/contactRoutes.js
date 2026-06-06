const express = require('express')
const { body } = require('express-validator')
const { submitContact } = require('../controllers/contactController')
const validateRequest = require('../middleware/validateRequest')

const router = express.Router()

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validateRequest,
  submitContact,
)

module.exports = router
