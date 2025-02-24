const { fetchAlbumById } = require("../models/albums-model");
const { fetchCommentsFromContent, uploadComment } = require("../models/comments-model");
const { fetchSongById } = require("../models/songs-model");

function getCommentsFromContent(request, response, next){
    const getContent = request.params.album_id ? fetchAlbumById(request.params.album_id) : fetchSongById(request.params.song_id)
    getContent.then(() => {
        return fetchCommentsFromContent(request.params)
    }).then((data) => {
        response.status(200).send(data);
    }).catch((err) => {
        next(err);
    })
}

function postComment(request, response, next){
    fetchSongById(request.params.song_id).then(() => {
        return uploadComment(request.params, request.body)
    }).then((comment) => {
        response.status(201).send({comment});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getCommentsFromContent, postComment };