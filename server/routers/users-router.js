const express = require("express")
const { getAllUsers } = require("../controllers/user-controller")
const users = express.Router()

users.get("/", getAllUsers)

module.exports = users