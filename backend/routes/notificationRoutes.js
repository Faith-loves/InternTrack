const express = require('express')
const { getNotifications } = require('../controllers/notificationController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)
router.get('/', getNotifications)

module.exports = router
