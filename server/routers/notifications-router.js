const express = require("express");
const { postNotification, patchNotification } = require("../controllers/notifications-controller");
const appCheckVerification = require("../app-check-verification");
const notifications = express.Router();

notifications.route("/")
.post([appCheckVerification], postNotification)

notifications.route("/:notification_id")
.patch([appCheckVerification], patchNotification)

module.exports = notifications;