import fetch from 'node-fetch'

function home(req, res) {
    res.render('home', {layout: 'index', loggedIn: !!req.session.access_token},)
}

async function search(req, res) {
    const searchQuery = req.query['songName']
    const accessToken = req.session.access_token

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        json: true
    };

    const searchResultsResponse = await fetch(`https://api.genius.com/search?q=${searchQuery}`, options)
    const searchResults = await searchResultsResponse.json()

    const mappedSearchResults = searchResults.response.hits.map(hit => {
        return {
            title: hit.result.title,
            artist: hit.result.primary_artist.name,
            url: `lyrics/${hit.result.id}`,
            thumbnail: hit.result.song_art_image_thumbnail_url,
            id: hit.result.id
        }
    });

    res.render('search', {
        layout: 'index',
        query: searchQuery,
        results: mappedSearchResults,
        loggedIn: !!req.session.access_token
    })
}

async function lyrics(req, res) {
    try {
        const songId = req.params.id
        const accessToken = req.session.access_token

        const songDetailsResponse = await fetch(`https://api.genius.com/songs/${songId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            json: true
        })
        const songDetails = await songDetailsResponse.json()

        const songPath = songDetails.response.song.path
        const songTitle = songDetails.response.song.title
        const songArtist = songDetails.response.song.primary_artist.name

        return res.render('lyrics', {
            layout: 'index',
            title: songTitle,
            artist: songArtist,
            songPath: songPath,
            loggedIn: !!accessToken
        })
    } catch (error) {
        // I have no clue why but somehow this function - and only this one -
        // executes twice throwing undefined errors around
        res.redirect('/')
    }
}

async function offline(req, res) {
    return res.render('offline', {
        layout: 'offline',
    })
}

export {
    home,
    search,
    lyrics,
    offline
}