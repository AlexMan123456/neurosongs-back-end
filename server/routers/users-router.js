const express = require("express")
const { getUsers, getUserById, postUser, patchUser, deleteUser } = require("../controllers/users-controller")
const users = express.Router()

users.route("/")
.get(getUsers)
.post(postUser)

users.route("/:user_id")
.get(getUserById)
.patch(patchUser)
.delete(deleteUser)

module.exports = users