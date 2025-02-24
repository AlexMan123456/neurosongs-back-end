const { fetchAlbumById } = require("../models/albums-model");
const { fetchCommentsFromContent } = require("../models/comments-model");
const { fetchSongById } = require("../models/songs-model");

function getCommentsFromContent(request, response, next){
    const getData = request.params.album_id ? fetchAlbumById(request.params.album_id) : fetchSongById(request.params.song_id)
    getData.then(() => {
        return fetchCommentsFromContent(request.params)
    }).then((data) => {
        response.status(200).send(data);
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getCommentsFromContent };