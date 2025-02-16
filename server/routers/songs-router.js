const express = require("express")
const { getAllSongs } = require("../controllers/songs-controller")
const songs = express.Router()

songs.route("/")
.get(getAllSongs)

module.exports = songs