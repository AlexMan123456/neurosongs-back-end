const { fetchAllUsers } = require("../models/user-model")

function getAllUsers(request, response, next){
    fetchAllUsers().then((users) => {
        response.status(200).send({users})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getAllUsers }