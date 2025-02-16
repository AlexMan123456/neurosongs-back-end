const { fetchAllSongs, fetchSongById, fetchSongsFromUser, uploadSong } = require("../models/songs-model");
const { fetchUserByUsername } = require("../models/users-model");

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
    fetchUserByUsername(request.params.username).then((user) => {
        return fetchSongsFromUser(user.username);
    }).then((songs) => {
        response.status(200).send({songs});
    }).catch((err) => {
        next(err);
    })
}

function postSong(request, response, next){
    uploadSong(request.params.username, request.body).then((song) => {
        response.status(201).send({song});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getAllSongs, getSongById, getSongsFromUser, postSong }