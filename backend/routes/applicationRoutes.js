const express = require('express')
const {
  createApplication,
  deleteApplication,
  getApplication,
  getApplications,
  updateApplication,
} = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')
const validateRequest = require('../middleware/validateRequest')
const {
  applicationCreateRules,
  applicationUpdateRules,
  mongoIdParam,
} = require('../middleware/validationRules')

const router = express.Router()

router.use(protect)

router.route('/').post(applicationCreateRules, validateRequest, createApplication).get(getApplications)
router
  .route('/:id')
  .get(mongoIdParam, validateRequest, getApplication)
  .put(applicationUpdateRules, validateRequest, updateApplication)
  .delete(mongoIdParam, validateRequest, deleteApplication)

module.exports = router
