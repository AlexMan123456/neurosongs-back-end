const express = require("express");
const { postNotification, patchNotification } = require("../controllers/notifications-controller");
const notifications = express.Router();

notifications.route("/")
.post(postNotification)

notifications.route("/:notification_id")
.patch(patchNotification)

module.exports = notifications;