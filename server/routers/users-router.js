const express = require("express")
const { getAllUsers, getUserById, postUser, patchUser } = require("../controllers/users-controller")
const { postAlbum } = require("../controllers/albums-controller")
const users = express.Router()

users.route("/")
.get(getAllUsers)
.post(postUser)

users.route("/:user_id")
.get(getUserById)
.patch(patchUser)

users.route("/:user_id/albums")
.post(postAlbum)

module.exports = users