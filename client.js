const { PrismaClient } = require('@prisma/client');

const ENV = process.env.NODE_ENV ?? "development";
require("dotenv").config({
    path: `${__dirname}/.env.${ENV}`
})

const prisma = new PrismaClient();
module.exports = prisma;