const express = require("express")
const { getSongs, getSongById, patchSong, deleteSong } = require("../controllers/songs-controller")
const { getCommentsFromContent: getCommentsFromSong, postComment } = require("../controllers/comments-controller")
const { postRating } = require("../controllers/ratings-controller")
const appCheckVerification = require("../app-check-verification")
const songs = express.Router()

songs.route("/")
.get([appCheckVerification], getSongs)

songs.route("/:song_id")
.get(getSongById)
.patch([appCheckVerification], patchSong)
.delete([appCheckVerification], deleteSong)

songs.route("/:song_id/comments")
.get(getCommentsFromSong)
.post([appCheckVerification], postComment)

songs.route("/:song_id/ratings")
.post([appCheckVerification], postRating)

module.exports = songs