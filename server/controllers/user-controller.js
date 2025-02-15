const { fetchAllUsers, fetchUserByUsername } = require("../models/user-model")

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
    })
}

module.exports = { getAllUsers, getUserByUsername }