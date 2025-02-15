const fs = require("fs")

const identities = fs.readFileSync(`${__dirname}/identities.png`, "base64");
const captainKevinPhoto = fs.readFileSync(`${__dirname}/captain-kevin.png`, "base64");
const lockdownPhoto = fs.readFileSync(`${__dirname}/lockdown.webp`, "base64");
const koolAlex = fs.readFileSync(`${__dirname}/KoolAlex.jpg`, "base64")

module.exports = {identities, captainKevinPhoto, lockdownPhoto, koolAlex}