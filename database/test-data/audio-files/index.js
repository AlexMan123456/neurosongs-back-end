const fs = require("fs")

const captainKevin = fs.readFileSync(`${__dirname}/captain-kevin.mp3`, "base64");
const placeInSociety = fs.readFileSync(`${__dirname}/place-in-society.mp3`, "base64")
const domination = fs.readFileSync(`${__dirname}/domination.mp3`, "base64");
const burnout = fs.readFileSync(`${__dirname}/burnout.mp3`, "base64");
const seeTheLight = fs.readFileSync(`${__dirname}/see-the-light.mp3`, "base64");
const thePirateWhoWantedTreasure = fs.readFileSync(`${__dirname}/the-pirate-who-wanted-treasure.mp3`, "base64");
const lockdown = fs.readFileSync(`${__dirname}/lockdown.mp3`, "base64")

module.exports = { captainKevin, placeInSociety, domination, burnout, seeTheLight, thePirateWhoWantedTreasure, lockdown };