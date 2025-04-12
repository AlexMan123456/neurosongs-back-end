const { fetchAlbumById } = require("../models/albums-model");
const { fetchCommentsFromContent, uploadComment, editComment, removeComment, fetchCommentReplies, uploadCommentReply, fetchCommentById } = require("../models/comments-model");
const { fetchSongById } = require("../models/songs-model");
const { fetchUserById } = require("../models/users-model");

function getCommentsFromContent(request, response, next){
    const {params} = request
    const getContent = params.album_id ? fetchAlbumById(params.album_id, request.header("App-SignedInUser")) : fetchSongById(params.song_id, request.header("App-SignedInUser"))
    getContent.then(() => {
        return fetchCommentsFromContent(params)
    }).then((comments) => {
        response.status(200).send({comments});
    }).catch((err) => {
        next(err);
    })
}

function getCommentById(request, response, next){
    fetchCommentById(request.params.comment_id).then((data) => {
        response.status(200).send(data);
    }).catch(next)
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
    const getContent = params.song_id ? fetchSongById(params.song_id, request.body.user_id) : fetchAlbumById(params.album_id, request.body.user_id)
    getContent.then(() => {
        return uploadComment(params, request.body)
    }).then((comment) => {
        response.status(201).send({comment});
    }).catch((err) => {
        next(err);
    })
}

function postCommentReply(request, response, next){
    return fetchUserById(request.body.user_id).then(() => {
        return uploadCommentReply(request.params.comment_id, request.body);
    }).then((reply) => {
        response.status(201).send({reply})
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

module.exports = { getCommentsFromContent, getCommentById, postComment, patchComment, deleteComment, getCommentReplies, postCommentReply };