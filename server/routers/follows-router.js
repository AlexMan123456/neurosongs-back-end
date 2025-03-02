const express = require("express");
const { postFollow } = require("../controllers/follows-controller");
const follows = express.Router();

follows.route("/follower/:follower_id/following/:following_id")
.post(postFollow)

module.exports = follows