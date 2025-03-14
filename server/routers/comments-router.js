const express = require("express");
const { patchComment, deleteComment, getCommentReplies, postCommentReply } = require("../controllers/comments-controller");
const comments = express.Router();

comments.route("/:comment_id")
.patch(patchComment)
.delete(deleteComment)

comments.route("/:comment_id/replies")
.get(getCommentReplies)
.post(postCommentReply)

module.exports = comments;
