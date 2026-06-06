const express = require('express')
const {
  deleteDocument,
  getDocuments,
  uploadDocument,
} = require('../controllers/documentController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const validateRequest = require('../middleware/validateRequest')
const { mongoIdParam } = require('../middleware/validationRules')

const router = express.Router()

router.use(protect)

router.post('/upload', upload.single('document'), uploadDocument)
router.get('/', getDocuments)
router.delete('/:id', mongoIdParam, validateRequest, deleteDocument)

module.exports = router
