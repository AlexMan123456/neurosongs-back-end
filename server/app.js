const express = require("express");
const users = require("./routers/users-router");
const { customErrors, internalServerError, prismaErrors, endpointNotFound } = require("./controllers/error-handling");
const songs = require("./routers/songs-router");
const albums = require("./routers/albums-router");
const app = express();
const cors = require("cors");
const comments = require("./routers/comments-router");
const getEndpoints = require("./controllers/endpoints-controller");
const ratings = require("./routers/ratings-router");
const follows = require("./routers/follows-router");
const notifications = require("./routers/notifications-router");
const links = require("./routers/links-router");

// Allow Cross Origin Resource Sharing
app.use(cors());

// Parse the request body
app.use(express.json());

// Getting endpoints
app.get("/api", getEndpoints)

// Routers
app.use("/api/users", users);
app.use("/api/songs", songs);
app.use("/api/albums", albums);
app.use("/api/comments", comments);
app.use("/api/ratings", ratings);
app.use("/api/follows", follows);
app.use("/api/notifications", notifications);
app.use("/api/links", links);

// Errors
app.use(endpointNotFound)
app.use(prismaErrors);
app.use(customErrors);
app.use(internalServerError);

module.exports = app