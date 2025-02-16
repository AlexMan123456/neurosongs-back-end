const express = require("express")
const { getAllUsers, getUserByUsername, postUser } = require("../controllers/user-controller")
const { getSongsFromUser } = require("../controllers/songs-controller")
const users = express.Router()

users.route("/")
.get(getAllUsers)
.post(postUser)

users.route("/:username")
.get(getUserByUsername)

users.route("/:username/songs")
.get(getSongsFromUser)

module.exports = users