const express = require("express");
const { patchLink } = require("../controllers/links-controller");
const links = express.Router();

links.route("/:link_id")
.patch(patchLink)

module.exports = links;