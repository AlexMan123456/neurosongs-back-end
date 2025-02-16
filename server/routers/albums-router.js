const express = require("express")
const { getAlbumById } = require("../controllers/albums-controller")
const albums = express.Router()

albums.route("/:album_id")
.get(getAlbumById)

module.exports = albums