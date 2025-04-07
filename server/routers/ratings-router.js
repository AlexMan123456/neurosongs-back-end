const express = require("express");
const { patchRating, deleteRating, getRating } = require("../controllers/ratings-controller");
const appCheckVerification = require("../app-check-verification");
const ratings = express.Router();

ratings.route("/:content_type/:content_id/users/:user_id")
.get(getRating)
.patch([appCheckVerification], patchRating)
.delete([appCheckVerification], deleteRating)

module.exports = ratings