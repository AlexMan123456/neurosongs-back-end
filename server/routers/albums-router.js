const express = require("express")
const { getAlbumById } = require("../controllers/albums-controller")
const { postSong } = require("../controllers/songs-controller")
const albums = express.Router()

albums.route("/:album_id")
.get(getAlbumById)

albums.route("/:album_id/songs")
.post(postSong)

module.exports = albums