const { fetchAlbumsFromUser, uploadAlbum, fetchAlbumById } = require("../models/albums-model");
const { fetchUserByUsername } = require("../models/users-model");

function getAlbumsFromUser(request, response, next){
    fetchUserByUsername(request.params.username).then((user) => {
        return fetchAlbumsFromUser(user.username);
    }).then((albums) => {
        response.status(200).send({albums});
    }).catch((err) => {
        next(err);
    })
}

function getAlbumById(request, response, next){
    fetchAlbumById(request.params.album_id).then((album) => {
        response.status(200).send({album});
    }).catch((err) => {
        console.log(err)
        next(err);
    })
}

function postAlbum(request, response, next){
    uploadAlbum(request.params.username, request.body).then((album) => {
        response.status(201).send({album});
    }).catch((err) => {
        next(err);
    })
}


module.exports = { getAlbumsFromUser, getAlbumById, postAlbum };