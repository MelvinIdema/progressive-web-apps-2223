import express from 'express'
import isAuthenticated from "../app/middlewares/isAuthenticated.js"
import * as AuthController from '../app/controllers/AuthController.js'
const AuthRouter = express.Router()

AuthRouter.get('/', AuthController.redirect);
AuthRouter.get('/callback', AuthController.callback)
AuthRouter.get('/logout', isAuthenticated, AuthController.logout)

export default AuthRouter