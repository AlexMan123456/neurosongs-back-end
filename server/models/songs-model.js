const database = require("../../client")

function fetchAllSongs(){
    return database.song.findMany({})
}

function fetchSongById(stringifiedSongID){
    const song_id = parseInt(stringifiedSongID);
    return database.song.findUnique({
        where: {song_id}
    })
}

module.exports = { fetchAllSongs, fetchSongById }