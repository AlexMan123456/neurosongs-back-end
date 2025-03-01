const { fetchAlbumById } = require("../models/albums-model");
const { uploadRating, updateRating } = require("../models/ratings-model");
const { fetchSongById } = require("../models/songs-model");
const { fetchUserById } = require("../models/users-model");

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

function patchRating(request, response, next){
    const {content_type, content_id, user_id} = request.params;

    fetchUserById(user_id).then(() => {
        return content_type === "songs" ? fetchSongById(content_id) : fetchAlbumById(content_id);
    }).then(() => {
        return updateRating(content_type, content_id, user_id, request.body)
    }).then((rating) => {
        response.status(200).send({rating});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { postRating, patchRating }