const { fetchAllSongs, fetchSongById, fetchSongsFromUser } = require("../models/songs-model");
const { fetchUserByUsername } = require("../models/user-model");

function getAllSongs(request, response, next){
    fetchAllSongs().then((songs) => {
        response.status(200).send({songs});
    }).catch((err) => {
        next(err);
    })
}

function getSongById(request, response, next){
    fetchSongById(request.params.song_id).then((song) => {
        response.status(200).send({song});
    }).catch((err) => {
        next(err);
    })
}

function getSongsFromUser(request, response, next){
    const {username} = request.params;
    fetchUserByUsername(username).then((user) => {
        return fetchSongsFromUser(user.username)
    }).then((songs) => {
        response.status(200).send({songs});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getAllSongs, getSongById, getSongsFromUser }