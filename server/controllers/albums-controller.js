const { fetchAlbumsFromUser } = require("../models/albums-model");

function getAlbumsFromUser(request, response, next){
    fetchAlbumsFromUser(request.params.username).then((albums) => {
        response.status(200).send({albums})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getAlbumsFromUser };