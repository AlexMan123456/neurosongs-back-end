const express = require("express");
const { postNotification } = require("../controllers/notifications-controller");
const notifications = express.Router();

notifications.route("/")
.post(postNotification)

module.exports = notifications;