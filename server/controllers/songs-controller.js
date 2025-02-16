const { fetchAllSongs } = require("../models/songs-model")

function getAllSongs(request, response, next){
    fetchAllSongs().then((songs) => {
        response.status(200).send({songs});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getAllSongs }