const express = require('express')
const {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany,
} = require('../controllers/companyController')
const { protect } = require('../middleware/authMiddleware')
const validateRequest = require('../middleware/validateRequest')
const { companyCreateRules, companyUpdateRules, mongoIdParam } = require('../middleware/validationRules')

const router = express.Router()

router.use(protect)

router.route('/').post(companyCreateRules, validateRequest, createCompany).get(getCompanies)
router
  .route('/:id')
  .get(mongoIdParam, validateRequest, getCompany)
  .put(companyUpdateRules, validateRequest, updateCompany)
  .delete(mongoIdParam, validateRequest, deleteCompany)

module.exports = router
