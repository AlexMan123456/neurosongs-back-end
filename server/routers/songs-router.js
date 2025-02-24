const express = require("express")
const { getSongs, getSongById } = require("../controllers/songs-controller")
const { getCommentsFromContent: getCommentsFromSong, postComment } = require("../controllers/comments-controller")
const songs = express.Router()

songs.route("/")
.get(getSongs)

songs.route("/:song_id")
.get(getSongById)

songs.route("/:song_id/comments")
.get(getCommentsFromSong)
.post(postComment)

module.exports = songs