const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/comment', authController.comment)
router.get('/getComments', authController.getComments)

module.exports = router