const express = require('express')
const router = express.Router()
const authController = require('../controllers/myprofile')

router.post('/update', authController.update)
router.post('/upgrade', authController.update)
router.post('/delete', authController.update)

module.exports = router