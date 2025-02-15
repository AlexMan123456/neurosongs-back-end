const express = require("express")
const { getAllUsers, getUserByUsername, postUser } = require("../controllers/user-controller")
const users = express.Router()

users.route("/")
.get(getAllUsers)
.post(postUser)

users.route("/:username")
.get(getUserByUsername)

module.exports = users