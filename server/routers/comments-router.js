const express = require("express");
const { patchComment, deleteComment, getCommentReplies, postCommentReply, getCommentById } = require("../controllers/comments-controller");
const appCheckVerification = require("../app-check-verification");
const comments = express.Router();

comments.route("/:comment_id")
.patch([appCheckVerification], patchComment)
.delete([appCheckVerification], deleteComment)
.get(getCommentById)

comments.route("/:comment_id/replies")
.get(getCommentReplies)
.post([appCheckVerification], postCommentReply)

module.exports = comments;
