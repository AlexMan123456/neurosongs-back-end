const { fetchSongs, fetchSongById, fetchSongsFromUser, uploadSong } = require("../models/songs-model");
const { fetchUserById: fetchUserByUsername } = require("../models/users-model");

function getSongs(request, response, next){
    fetchSongs(request.query).then((songs) => {
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
    fetchUserByUsername(request.params.user_id).then((user) => {
        return fetchSongsFromUser(user.user_id);
    }).then((songs) => {
        response.status(200).send({songs});
    }).catch((err) => {
        next(err);
    })
}

function postSong(request, response, next){
    uploadSong(request.params.album_id, request.body).then((song) => {
        response.status(201).send({song});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getSongs, getSongById, getSongsFromUser, postSong }