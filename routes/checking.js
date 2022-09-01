const express = require('express')
const router = express.Router()
const authController = require('../controllers/comment')

router.get('/checkPremium', authController.checkPremium)


module.exports = router