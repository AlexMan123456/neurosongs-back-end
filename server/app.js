const express = require("express");
const users = require("./routers/users-router");
const { customErrors } = require("./controllers/error-handling");
const app = express()

app.use("/api/users", users)

// Errors
app.use(customErrors)

module.exports = app