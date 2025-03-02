const express = require("express");
const { postFollow, deleteFollow } = require("../controllers/follows-controller");
const follows = express.Router();

follows.route("/follower/:follower_id/following/:following_id")
.post(postFollow)
.delete(deleteFollow)

module.exports = follows