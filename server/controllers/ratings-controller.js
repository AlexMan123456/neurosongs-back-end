const { fetchAlbumById } = require("../models/albums-model");
const { uploadRating } = require("../models/ratings-model");
const { fetchSongById } = require("../models/songs-model");

function postRating(request, response, next){
    const contentType = request.params.song_id ? "song" : "album"

    const fetchContent = contentType === "song" ? fetchSongById(request.params.song_id) : fetchAlbumById(request.params.getAlbumById);
    fetchContent.then(() => {
        return uploadRating(request.params[`${contentType}_id`], request.body, contentType)
    }).then((rating) => {
        response.status(201).send({rating})
    }).catch((err) => {
        next(err);
    })
}

module.exports = { postRating }