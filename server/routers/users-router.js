const express = require("express")
const { getAllUsers, getUserByUsername, postUser } = require("../controllers/users-controller")
const { getSongsFromUser, postSong } = require("../controllers/songs-controller")
const { getAlbumsFromUser } = require("../controllers/albums-controller")
const users = express.Router()

users.route("/")
.get(getAllUsers)
.post(postUser)

users.route("/:username")
.get(getUserByUsername)

users.route("/:username/songs")
.get(getSongsFromUser)
.post(postSong)

users.route("/:username/albums")
.get(getAlbumsFromUser)

module.exports = users