const express = require("express")
const { getAllUsers, getUserById, postUser } = require("../controllers/users-controller")
const { getSongsFromUser, postSong } = require("../controllers/songs-controller")
const { getAlbumsFromUser, postAlbum } = require("../controllers/albums-controller")
const users = express.Router()

users.route("/")
.get(getAllUsers)
.post(postUser)

users.route("/:user_id")
.get(getUserById)

users.route("/:user_id/songs")
.get(getSongsFromUser)

users.route("/:user_id/albums")
.get(getAlbumsFromUser)
.post(postAlbum)

module.exports = users