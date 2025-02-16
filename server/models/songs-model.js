const database = require("../../client")

function fetchAllSongs(){
    return database.song.findMany({})
}

module.exports = { fetchAllSongs }