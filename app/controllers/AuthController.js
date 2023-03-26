import request from "request-promise";

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

    return await request(options)
}

function redirect(req, res) {
    const authUrl = `https://api.genius.com/oauth/authorize?client_id=${process.env.GENIUS_CLIENT_ID}&redirect_uri=${process.env.GENIUS_REDIRECT_URI}&scope=me&response_type=code`
    res.redirect(authUrl)
}

async function callback(req, res) {
    try {
        const code = req.query.code
        const token = await requestAccessToken(code)
        req.session.access_token = token.access_token
        res.redirect('/')
    } catch (error) {
        console.error('Error during token request:', error)
        res.redirect('/')
    }
}

function logout(req, res) {
    req.session.destroy()
    res.redirect('/')
}

export {
    redirect,
    callback,
    logout
}