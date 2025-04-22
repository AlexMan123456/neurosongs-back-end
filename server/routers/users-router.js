const express = require("express")
const { getUsers, getUserById, postUser, patchUser, deleteUser } = require("../controllers/users-controller")
const { getNotificationsFromUser } = require("../controllers/notifications-controller")
const appCheckVerification = require("../app-check-verification")
const { getLinksFromUser, postLink } = require("../controllers/links-controller")
const users = express.Router()

users.route("/")
.get(getUsers)
.post([appCheckVerification], postUser)

users.route("/:user_id")
.get(getUserById)
.patch([appCheckVerification], patchUser)
.delete([appCheckVerification], deleteUser)

users.route("/:user_id/notifications")
.get(getNotificationsFromUser)

users.route("/:user_id/links")
.get(getLinksFromUser)
.post([appCheckVerification], postLink)

module.exports = users