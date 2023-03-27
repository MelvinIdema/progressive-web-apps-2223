import * as dotenv from "dotenv";
dotenv.config();

import express from 'express'
import {engine} from 'express-handlebars'
import session from 'express-session'

import Redis from 'ioredis'
import RedisStore from 'connect-redis'

import AppRouter from "./routes/App.js"
import AuthRouter from './routes/Auth.js'
import UserRouter from "./routes/User.js"

import fs from 'fs'
import https from 'https'

let key;
let cert;

if(process.env.NODE_ENV === "development") {
    key = fs.readFileSync('./ssl/localhost-key.pem')
    cert = fs.readFileSync('./ssl/localhost.pem')
}

let client = new Redis(process.env.REDIS_URL)

let redisStore = new RedisStore({
    client: client,
    prefix: 'lyriq'
})

const app = express()
const port = process.env.PORT || 3000;

// Session
app.use(session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));

// Static files
app.use(express.static('public'))

// View engine
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use('/', AppRouter)
app.use('/auth', AuthRouter)
app.use('/user', UserRouter)

if(process.env.NODE_ENV === "development") {
    https.createServer({ key, cert }, app).listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
}

if(process.env.NODE_ENV === "production") {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
}