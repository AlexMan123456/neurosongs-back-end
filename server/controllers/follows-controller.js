const { uploadFollow, removeFollow } = require("../models/follows-model");
const { fetchUserById } = require("../models/users-model");

function postFollow(request, response, next){
    fetchUserById(request.params.follower_id).then(() => {
        return fetchUserById(request.params.following_id)
    }).then(() => {
        return uploadFollow(request.params.follower_id, request.params.following_id)
    }).then((follow) => {
        response.status(201).send({follow})
    }).catch((err) => {
        next(err);
    })
}

function deleteFollow(request, response, next){
    fetchUserById(request.params.follower_id).then(() => {
        return fetchUserById(request.params.following_id)
    }).then(() => {
        return removeFollow(request.params.follower_id, request.params.following_id)
    }).then(() => {
        response.status(204).send({})
    }).catch((err) => {
        next(err);
    })
}

module.exports = { postFollow, deleteFollow };