const { fetchAllSongs, fetchSongById } = require("../models/songs-model")

function getAllSongs(request, response, next){
    fetchAllSongs().then((songs) => {
        response.status(200).send({songs});
    }).catch((err) => {
        next(err);
    })
}

function getSongById(request, response, next){
    fetchSongById(parseInt(request.params.song_id)).then((song) => {
        response.status(200).send({song})
    })
}

module.exports = { getAllSongs, getSongById }