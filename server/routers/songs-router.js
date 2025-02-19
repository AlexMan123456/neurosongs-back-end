const express = require("express")
const { getSongs, getSongById } = require("../controllers/songs-controller")
const songs = express.Router()

songs.route("/")
.get(getSongs)

songs.route("/:song_id")
.get(getSongById)

module.exports = songs