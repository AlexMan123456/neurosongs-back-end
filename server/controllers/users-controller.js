const { fetchAllUsers, fetchUserByUsername, uploadUser } = require("../models/users-model")

function getAllUsers(request, response, next){
    fetchAllUsers().then((users) => {
        response.status(200).send({users})
    }).catch((err) => {
        next(err)
    })
}

function getUserByUsername(request, response, next){
    fetchUserByUsername(request.params.username).then((user) => {
        response.status(200).send({user})
    }).catch((err) => {
        next(err)
    })
}

function postUser(request, response, next){
    uploadUser(request.body).then((user) => {
        response.status(201).send({user})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getAllUsers, getUserByUsername, postUser }