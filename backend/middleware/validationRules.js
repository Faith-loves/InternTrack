const { body, param } = require('express-validator')
const { APPLICATION_STATUSES } = require('../utils/constants')

const optionalUrl = (field, message) =>
  body(field).optional({ checkFalsy: true }).isURL({ require_protocol: true }).withMessage(message)

const optionalEmail = (field, message) =>
  body(field).optional({ checkFalsy: true }).isEmail().withMessage(message)

const mongoIdParam = [param('id').isMongoId().withMessage('Invalid record ID')]

const signupRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  optionalUrl('portfolioLink', 'Portfolio link must be a valid URL'),
  optionalUrl('linkedinLink', 'LinkedIn link must be a valid URL'),
  optionalUrl('githubLink', 'GitHub link must be a valid URL'),
]

const loginRules = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

const profileRules = [
  body('fullName').optional().trim().notEmpty().withMessage('Name is required'),
  body('email').optional().trim().isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  optionalUrl('portfolioLink', 'Portfolio link must be a valid URL'),
  optionalUrl('linkedinLink', 'LinkedIn link must be a valid URL'),
  optionalUrl('githubLink', 'GitHub link must be a valid URL'),
]

const refreshTokenRules = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
]

const tokenRules = [
  body('token').notEmpty().withMessage('Token is required'),
]

const forgotPasswordRules = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
]

const resetPasswordRules = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const applicationCreateRules = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('status').optional().isIn(APPLICATION_STATUSES).withMessage('Status is not supported'),
  body('salaryMin').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Minimum salary must be 0 or more'),
  body('salaryMax').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Maximum salary must be 0 or more'),
  optionalUrl('applicationLink', 'Application link must be a valid URL'),
  optionalEmail('recruiterEmail', 'Recruiter email must be valid'),
]

const applicationUpdateRules = [
  ...mongoIdParam,
  body('companyName').optional().trim().notEmpty().withMessage('Company name is required'),
  body('jobTitle').optional().trim().notEmpty().withMessage('Job title is required'),
  body('status').optional().isIn(APPLICATION_STATUSES).withMessage('Status is not supported'),
  body('salaryMin').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Minimum salary must be 0 or more'),
  body('salaryMax').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Maximum salary must be 0 or more'),
  optionalUrl('applicationLink', 'Application link must be a valid URL'),
  optionalEmail('recruiterEmail', 'Recruiter email must be valid'),
]

const companyCreateRules = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  optionalEmail('email', 'Company email must be valid'),
  optionalUrl('website', 'Company website must be a valid URL'),
  optionalUrl('linkedin', 'LinkedIn must be a valid URL'),
]

const companyUpdateRules = [
  ...mongoIdParam,
  body('companyName').optional().trim().notEmpty().withMessage('Company name is required'),
  optionalEmail('email', 'Company email must be valid'),
  optionalUrl('website', 'Company website must be a valid URL'),
  optionalUrl('linkedin', 'LinkedIn must be a valid URL'),
]

const interviewCreateRules = [
  body('applicationId').isMongoId().withMessage('Application is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('outcome').optional().isIn(['scheduled', 'completed', 'passed', 'rejected', 'offer', 'cancelled']).withMessage('Interview outcome is not supported'),
  body('preparationChecklist').optional().isArray().withMessage('Preparation checklist must be a list'),
  optionalUrl('interviewLink', 'Interview link must be a valid URL'),
]

const interviewUpdateRules = [
  ...mongoIdParam,
  body('applicationId').optional().isMongoId().withMessage('Application is invalid'),
  body('date').optional().notEmpty().withMessage('Date is required'),
  body('time').optional().notEmpty().withMessage('Time is required'),
  body('outcome').optional().isIn(['scheduled', 'completed', 'passed', 'rejected', 'offer', 'cancelled']).withMessage('Interview outcome is not supported'),
  body('preparationChecklist').optional().isArray().withMessage('Preparation checklist must be a list'),
  optionalUrl('interviewLink', 'Interview link must be a valid URL'),
]

module.exports = {
  applicationCreateRules,
  applicationUpdateRules,
  companyCreateRules,
  companyUpdateRules,
  forgotPasswordRules,
  interviewCreateRules,
  interviewUpdateRules,
  loginRules,
  mongoIdParam,
  profileRules,
  refreshTokenRules,
  resetPasswordRules,
  signupRules,
  tokenRules,
}
