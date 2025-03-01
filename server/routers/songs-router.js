const express = require("express")
const { getSongs, getSongById, patchSong, deleteSong } = require("../controllers/songs-controller")
const { getCommentsFromContent: getCommentsFromSong, postComment } = require("../controllers/comments-controller")
const { postRating } = require("../controllers/ratings-controller")
const songs = express.Router()

songs.route("/")
.get(getSongs)

songs.route("/:song_id")
.get(getSongById)
.patch(patchSong)
.delete(deleteSong)

songs.route("/:song_id/comments")
.get(getCommentsFromSong)
.post(postComment)

songs.route("/:song_id/ratings")
.post(postRating)

module.exports = songs