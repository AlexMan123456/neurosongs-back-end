const express = require("express");
const { patchRating, deleteRating } = require("../controllers/ratings-controller");
const ratings = express.Router();

ratings.route("/:content_type/:content_id/users/:user_id")
.patch(patchRating)
.delete(deleteRating)

module.exports = ratings