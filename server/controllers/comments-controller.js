const { fetchAlbumById } = require("../models/albums-model");
const { fetchCommentsFromContent, uploadComment, editComment, removeComment, fetchCommentReplies } = require("../models/comments-model");
const { fetchSongById } = require("../models/songs-model");

function getCommentsFromContent(request, response, next){
    const {params} = request
    const getContent = params.album_id ? fetchAlbumById(params.album_id) : fetchSongById(params.song_id)
    getContent.then(() => {
        return fetchCommentsFromContent(params)
    }).then((comments) => {
        response.status(200).send({comments});
    }).catch((err) => {
        next(err);
    })
}

function getCommentReplies(request, response, next){
    fetchCommentReplies(request.params.comment_id).then((replies) => {
        response.status(200).send({replies})
    }).catch((err) => {
        next(err)
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

function deleteComment(request, response, next){
    removeComment(request.params.comment_id).then(() => {
        response.status(204).send({});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getCommentsFromContent, postComment, patchComment, deleteComment, getCommentReplies };