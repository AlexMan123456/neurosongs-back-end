const { fetchAlbumsFromUser } = require("../models/albums-model");
const { fetchUserByUsername } = require("../models/users-model");

function getAlbumsFromUser(request, response, next){
    fetchUserByUsername(request.params.username).then((user) => {
        return fetchAlbumsFromUser(user.username)
    }).then((albums) => {
        response.status(200).send({albums})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getAlbumsFromUser };