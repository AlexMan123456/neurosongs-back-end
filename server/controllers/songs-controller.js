const { fetchSongs, fetchSongById, fetchSongsFromUser, uploadSong, editSong, removeSong } = require("../models/songs-model");
const { fetchUserById } = require("../models/users-model");

async function getSongs(request, response, next){
    try {
        if(request.query){
            if(request.query.user_id){
                await fetchUserById(request.query.user_id);
            }
        }
        const songs = await fetchSongs(request.query);
        response.status(200).send({songs});
    } catch(err) {
        next(err);
    }
}

function getSongById(request, response, next){
    fetchSongById(request.params.song_id).then((song) => {
        response.status(200).send({song});
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

function patchSong(request, response, next){
    editSong(request.params.song_id, request.body).then((song) => {
        response.status(200).send({song})
    }).catch((err) => {
        next(err);
    })
}

function deleteSong(request, response, next){
    removeSong(request.params.song_id).then(() => {
        response.status(204).send({});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getSongs, getSongById, postSong, patchSong, deleteSong }