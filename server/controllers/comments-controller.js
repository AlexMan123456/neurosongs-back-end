const { fetchAlbumById } = require("../models/albums-model");
const { fetchCommentsFromContent, uploadComment, editComment } = require("../models/comments-model");
const { fetchSongById } = require("../models/songs-model");

function getCommentsFromContent(request, response, next){
    const {params} = request
    const getContent = params.album_id ? fetchAlbumById(params.album_id) : fetchSongById(params.song_id)
    getContent.then(() => {
        return fetchCommentsFromContent(params)
    }).then((data) => {
        response.status(200).send(data);
    }).catch((err) => {
        next(err);
    })
}

function postComment(request, response, next){
    const {params} = request
    const getContent = params.song_id ? fetchSongById(params.song_id) : fetchAlbumById(params.album_id)
    getContent.then(() => {
        return uploadComment(params, request.body)
    }).then((comment) => {
        response.status(201).send({comment});
    }).catch((err) => {
        next(err);
    })
}

function patchComment(request, response, next){
    editComment(request.params.comment_id, request.body).then((comment) => {
        response.status(200).send({comment});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getCommentsFromContent, postComment, patchComment };