import express from 'express'
import isAuthenticated from "../app/middlewares/isAuthenticated.js"
import * as UserController from '../app/controllers/UserController.js'

const UserRouter = express.Router()

UserRouter.get('/me', isAuthenticated, UserController.show)

export default UserRouter