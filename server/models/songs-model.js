const database = require("../../client")

function fetchSongs(queries){
    const request = {
        include: {
            artist: {
                select: {
                    username: true,
                    artist_name: true
                }
            }
        }
    }

    if(queries.is_featured){
        if(queries.is_featured.toLowerCase() !== "true" && queries.is_featured.toLowerCase() !== "false"){
            return Promise.reject({status: 400, message: "Bad request"});
        }
        const is_featured = queries.is_featured.toLowerCase() === "true";
        request.where = {is_featured};
    }

    return database.song.findMany(request)
}

function fetchSongById(stringifiedSongID){
    const song_id = parseInt(stringifiedSongID);
    return database.song.findUnique({
        where: {song_id},
        include: {
            artist: {
                select: {
                    username: true,
                    artist_name: true
                }
            }
        }
    }).then((song) => {
        if(!song){
            return Promise.reject({status: 404, message: "Song not found"});
        }
        return song;
    })
}

function fetchSongsFromUser(user_id){
    return database.song.findMany({
        where: {
            user_id
        },
        include: {
            artist: {
                select: {
                    username: true,
                    artist_name: true
                }
            }
        }
    })
}

function uploadSong(album_id, song){
    const data = {...song};
    data.album_id = parseInt(album_id);

    if(data.reference){
        if(data.reference.includes("/") || !data.reference.includes(".")){
            return Promise.reject({status: 400, message: "Invalid file name"})
        }
    }

    return database.song.create({
        data,
        include: {
            artist: {
                select: {
                    username: true,
                    artist_name: true
                }
            }
        }
    })
}

module.exports = { fetchSongs, fetchSongById, fetchSongsFromUser, uploadSong }