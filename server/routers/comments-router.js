const express = require("express");
const { patchComment } = require("../controllers/comments-controller");
const comments = express.Router();

comments.route("/:comment_id")
.patch(patchComment)

module.exports = comments;
