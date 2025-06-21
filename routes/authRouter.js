const express = require('express')
const authRouter = express.Router()
const path = require('path')

const authController = require('../controllers/authcontroller')

authRouter.post('/', authController.handleLogin)

module.exports = authRouter
