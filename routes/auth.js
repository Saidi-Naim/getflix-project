const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/comment', authController.comment)

module.exports = router