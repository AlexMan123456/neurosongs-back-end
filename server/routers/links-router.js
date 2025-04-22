const express = require("express");
const { patchLink, deleteLink } = require("../controllers/links-controller");
const appCheckVerification = require("../app-check-verification");
const links = express.Router();

links.route("/:link_id")
.patch([appCheckVerification], patchLink)
.delete([appCheckVerification], deleteLink)

module.exports = links;