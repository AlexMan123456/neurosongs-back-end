const express = require("express");
const { postFollow, deleteFollow } = require("../controllers/follows-controller");
const appCheckVerification = require("../app-check-verification");
const follows = express.Router();

follows.route("/follower/:follower_id/following/:following_id")
.post([appCheckVerification], postFollow)
.delete([appCheckVerification], deleteFollow)

module.exports = follows