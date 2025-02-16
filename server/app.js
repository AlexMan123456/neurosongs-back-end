const express = require("express");
const users = require("./routers/users-router");
const { customErrors, internalServerError, prismaErrors } = require("./controllers/error-handling");
const app = express();

// Parse the request body
app.use(express.json());

// Routers
app.use("/api/users", users);

// Errors
app.use(prismaErrors);
app.use(customErrors);
app.use(internalServerError);

module.exports = app