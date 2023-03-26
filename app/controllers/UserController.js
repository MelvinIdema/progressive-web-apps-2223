import request from "request-promise";

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

async function show(req, res) {
    try {
        const userProfile = await requestGeniusUserProfile(req.session.access_token)
        res.json(userProfile)
    } catch (error) {
        console.error('Error during user profile request:', error);
        res.redirect('/')
    }
}

export {
    show
}