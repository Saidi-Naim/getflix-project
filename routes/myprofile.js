const express = require('express')
const router = express.Router()
const authController = require('../controllers/myprofile')

router.post('/update', authController.update)
router.post('/delete', authController.delete)

module.exports = router