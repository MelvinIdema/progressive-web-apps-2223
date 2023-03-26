import request from 'request-promise'
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

export {requestAccessToken}