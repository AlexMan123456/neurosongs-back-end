const { fetchAlbumsFromUser, uploadAlbum, fetchAlbumById, fetchAlbums } = require("../models/albums-model");
const { fetchUserById: fetchUserById } = require("../models/users-model");

function getAlbums(request, response, next){
    fetchAlbums(request.query).then((albums) => {
        response.status(200).send({albums});
    }).catch((err) => {
        next(err);
    })
}

function getAlbumsFromUser(request, response, next){
    fetchUserById(request.params.user_id).then((user) => {
        return fetchAlbumsFromUser(user.user_id);
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
        next(err);
    })
}

function postAlbum(request, response, next){
    uploadAlbum(request.params.user_id, request.body).then((album) => {
        response.status(201).send({album});
    }).catch((err) => {
        next(err);
    })
}


module.exports = { getAlbumsFromUser, getAlbumById, postAlbum, getAlbums };