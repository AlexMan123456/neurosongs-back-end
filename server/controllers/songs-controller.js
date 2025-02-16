const { fetchAllSongs, fetchSongById } = require("../models/songs-model")

function getAllSongs(request, response, next){
    fetchAllSongs().then((songs) => {
        response.status(200).send({songs});
    }).catch((err) => {
        next(err);
    })
}

function getSongById(request, response, next){
    fetchSongById(request.params.song_id).then((song) => {
        response.status(200).send({song})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getAllSongs, getSongById }