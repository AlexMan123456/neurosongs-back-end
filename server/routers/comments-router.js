const express = require("express");
const { patchComment, deleteComment } = require("../controllers/comments-controller");
const comments = express.Router();

comments.route("/:comment_id")
.patch(patchComment)
.delete(deleteComment)

module.exports = comments;
