const express = require("express");
const users = require("./routers/users-router");
const app = express()

app.use("/api/users", users)

module.exports = app