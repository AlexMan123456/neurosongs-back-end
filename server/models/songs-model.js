const database = require("../../client")

function fetchAllSongs(){
    return database.song.findMany({})
}

function fetchSongById(song_id){
    return database.song.findUnique({
        where: {song_id}
    })
}

module.exports = { fetchAllSongs, fetchSongById }