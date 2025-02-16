const database = require("../../client")

function fetchAllSongs(){
    return database.song.findMany({
        include: {
            artist: {
                select: {
                    artist_name: true
                }
            }
        }
    })
}

function fetchSongById(stringifiedSongID){
    const song_id = parseInt(stringifiedSongID);
    return database.song.findUnique({
        where: {song_id},
        include: {
            artist: {
                select: {
                    artist_name: true
                }
            }
        }
    }).then((song) => {
        if(!song){
            return Promise.reject({status: 404, message: "Song not found"});
        }
        return song
    })
}

function fetchSongsFromUser(username){
    return database.song.findMany({
        where: {
            username
        },
        include: {
            artist: {
                select: {
                    artist_name: true
                }
            }
        }
    })
}

function uploadSong(album_id, song){
    const data = {...song};
    data.album_id = parseInt(album_id);
    return database.song.create({
        data,
        include: {
            artist: {
                select: {
                    artist_name: true
                }
            }
        }
    });
}

module.exports = { fetchAllSongs, fetchSongById, fetchSongsFromUser, uploadSong }