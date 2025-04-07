const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

const ENV = process.env.NODE_ENV ?? "development";
require("dotenv").config({
    path: `${__dirname}/../.env.${ENV}`
})

const prisma = new PrismaClient().$extends(withAccelerate());
module.exports = prisma;