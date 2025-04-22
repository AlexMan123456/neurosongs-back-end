const express = require("express");
const { patchLink } = require("../controllers/links-controller");
const appCheckVerification = require("../app-check-verification");
const links = express.Router();

links.route("/:link_id")
.patch([appCheckVerification], patchLink)

module.exports = links;