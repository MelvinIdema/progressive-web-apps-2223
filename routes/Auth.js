import express from 'express'
import * as AuthController from '../app/controllers/AuthController.js'
const AuthRouter = express.Router()

AuthRouter.get('/', AuthController.redirect);
AuthRouter.get('/callback', AuthController.callback)
AuthRouter.get('/logout', AuthController.logout)

export default AuthRouter