const { uploadAlbum, fetchAlbumById, fetchAlbums } = require("../models/albums-model");
const { fetchUserById } = require("../models/users-model");

async function getAlbums(request, response, next){
    try {
        if(request.query){
            if(request.query.user_id){
                await fetchUserById(request.query.user_id);
            }
        }
        const albums = await fetchAlbums(request.query);
        response.status(200).send({albums});
    } catch(err) {
        next(err);
    }
    fetchAlbums(request.query).then((albums) => {
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
    uploadAlbum(request.body).then((album) => {
        response.status(201).send({album});
    }).catch((err) => {
        next(err);
    })
}


module.exports = { getAlbumById, postAlbum, getAlbums };