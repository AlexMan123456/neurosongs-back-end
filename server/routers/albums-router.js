const express = require("express")
const { getAlbumById, getAlbums, postAlbum, patchAlbum, deleteAlbum, patchIndex } = require("../controllers/albums-controller")
const { postSong } = require("../controllers/songs-controller")
const { getCommentsFromContent, postComment } = require("../controllers/comments-controller")
const { postRating } = require("../controllers/ratings-controller")
const appCheckVerification = require("../app-check-verification")
const albums = express.Router()

albums.route("/")
.get(getAlbums)
.post([appCheckVerification], postAlbum)

albums.route("/:album_id")
.get(getAlbumById)
.patch([appCheckVerification], patchAlbum)
.delete([appCheckVerification], deleteAlbum)

albums.route("/:album_id/songs")
.post([appCheckVerification], postSong)

albums.route("/:album_id/comments")
.get(getCommentsFromContent)
.post([appCheckVerification], postComment)

albums.route("/:album_id/ratings")
.post([appCheckVerification], postRating)

albums.route("/:album_id/reset_index")
.patch([appCheckVerification], patchIndex)

module.exports = albums