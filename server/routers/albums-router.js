const express = require("express")
const { getAlbumById, getAlbums, postAlbum, patchAlbum, deleteAlbum } = require("../controllers/albums-controller")
const { postSong } = require("../controllers/songs-controller")
const { getCommentsFromContent, postComment } = require("../controllers/comments-controller")
const albums = express.Router()

albums.route("/")
.get(getAlbums)
.post(postAlbum)

albums.route("/:album_id")
.get(getAlbumById)
.patch(patchAlbum)
.delete(deleteAlbum)

albums.route("/:album_id/songs")
.post(postSong)

albums.route("/:album_id/comments")
.get(getCommentsFromContent)
.post(postComment)

module.exports = albums