const express = require("express")
const { getAllUsers, getUserByUsername } = require("../controllers/user-controller")
const users = express.Router()

users.get("/", getAllUsers)
users.get("/:username", getUserByUsername)

module.exports = users