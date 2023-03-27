import express from 'express'
const AppRouter = express.Router()
import * as AppController from '../app/controllers/AppController.js'
import isAuthenticated from "../app/middlewares/isAuthenticated.js";

AppRouter.get('/', AppController.home)
AppRouter.get('/search', isAuthenticated, AppController.search)
AppRouter.get('/lyrics/:id', isAuthenticated, AppController.lyrics)
AppRouter.get('/offline', AppController.offline)

export default AppRouter