const express = require("express");
const users = require("./routers/users-router");
const { customErrors, internalServerError, prismaErrors, endpointNotFound } = require("./controllers/error-handling");
const songs = require("./routers/songs-router");
const app = express();

// Parse the request body
app.use(express.json());

// Routers
app.use("/api/users", users);
app.use("/api/songs", songs);

// Errors
app.use(endpointNotFound)
app.use(prismaErrors);
app.use(customErrors);
app.use(internalServerError);

module.exports = app