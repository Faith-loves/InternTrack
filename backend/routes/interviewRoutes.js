const express = require('express')
const {
  createInterview,
  deleteInterview,
  getInterview,
  getInterviews,
  updateInterview,
} = require('../controllers/interviewController')
const { protect } = require('../middleware/authMiddleware')
const validateRequest = require('../middleware/validateRequest')
const { interviewCreateRules, interviewUpdateRules, mongoIdParam } = require('../middleware/validationRules')

const router = express.Router()

router.use(protect)

router.route('/').post(interviewCreateRules, validateRequest, createInterview).get(getInterviews)
router
  .route('/:id')
  .get(mongoIdParam, validateRequest, getInterview)
  .put(interviewUpdateRules, validateRequest, updateInterview)
  .delete(mongoIdParam, validateRequest, deleteInterview)

module.exports = router
