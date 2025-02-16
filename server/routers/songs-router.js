const express = require("express")
const { getAllSongs, getSongById } = require("../controllers/songs-controller")
const songs = express.Router()

songs.route("/")
.get(getAllSongs)

songs.route("/:song_id")
.get(getSongById)

module.exports = songs