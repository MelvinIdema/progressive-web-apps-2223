require('dotenv').config();
const express = require('express');

const session = require('express-session');
const request = require('request-promise');

const Redis = require("ioredis");
const RedisStore = require("connect-redis").default

let client = new Redis(`rediss://default:${process.env.REDIS_SECRET}@eu1-awake-condor-39125.upstash.io:39125`);

let redisStore = new RedisStore({
    client: client,
    prefix: 'lyriq'
})

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));

app.get('/', (req, res) => {
    res.send('<a href="/auth">Login with Genius</a>');
});

app.get('/auth', (req, res) => {
    const authUrl = `https://api.genius.com/oauth/authorize?client_id=${process.env.GENIUS_CLIENT_ID}&redirect_uri=${process.env.GENIUS_REDIRECT_URI}&scope=me&response_type=code`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    try {
        const code = req.query.code;
        const token = await requestAccessToken(code);
        req.session.access_token = token.access_token;
        res.redirect('/me');
    } catch (error) {
        console.error('Error during token request:', error);
        res.redirect('/');
    }
});

app.get('/me', async (req, res) => {
    try {
        const userProfile = await requestGeniusUserProfile(req.session.access_token);
        res.json(userProfile);
    } catch (error) {
        console.error('Error during user profile request:', error);
        res.redirect('/');
    }
});

async function requestAccessToken(code) {
    const options = {
        method: 'POST',
        uri: 'https://api.genius.com/oauth/token',
        form: {
            code: code,
            client_id: process.env.GENIUS_CLIENT_ID,
            client_secret: process.env.GENIUS_CLIENT_SECRET,
            redirect_uri: process.env.GENIUS_REDIRECT_URI,
            response_type: 'code',
            grant_type: 'authorization_code'
        },
        json: true
    };

    return await request(options);
}

async function requestGeniusUserProfile(access_token) {
    const options = {
        method: 'GET',
        uri: 'https://api.genius.com/account',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
        json: true
    };
    return await request(options);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});