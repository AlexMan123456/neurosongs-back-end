const { fetchAllUsers, fetchUserById, uploadUser, updateUser } = require("../models/users-model")

function getAllUsers(request, response, next){
    fetchAllUsers().then((users) => {
        response.status(200).send({users});
    }).catch((err) => {
        next(err);
    })
}

function getUserById(request, response, next){
    fetchUserById(request.params.user_id).then((user) => {
        response.status(200).send({user});
    }).catch((err) => {
        next(err);
    })
}

function postUser(request, response, next){
    uploadUser(request.body).then((user) => {
        response.status(201).send({user});
    }).catch((err) => {
        next(err);
    })
}

function patchUser(request, response, next){
    updateUser(request.params.user_id, request.body).then((user) => {
        response.status(200).send({user});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getAllUsers, getUserById, postUser, patchUser }