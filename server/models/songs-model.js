const database = require("../../client")

function fetchSongs(queries){
    const request = {
        include: {
            artist: {
                select: {
                    username: true,
                    artist_name: true
                }
            },
            album: {
                select: {
                    front_cover_reference: true,
                    title: true
                }
            },
            description: false
        }
    }

    if(queries.user_id){
        const user_id = queries.user_id;
        request.where = {user_id}
    }

    if(queries.is_featured){
        if(queries.is_featured.toLowerCase() !== "true" && queries.is_featured.toLowerCase() !== "false"){
            return Promise.reject({status: 400, message: "Bad request"});
        }
        const is_featured = queries.is_featured.toLowerCase() === "true";
        request.where = {is_featured};
    }

    if(queries.search_query){
        request.where = {
            title: {
                contains: queries.search_query,
                mode: "insensitive"
            }
        }
    }

    request.orderBy = {[queries.sort_by ?? "created_at"]: queries.order ?? "desc"};
    

    return database.song.findMany(request);
}

function fetchSongById(stringifiedSongID){
    const song_id = parseInt(stringifiedSongID);
    return Promise.all([database.song.findUnique({
            where: {song_id},
            include: {
                artist: {
                    select: {
                        username: true,
                        artist_name: true
                    }
                },
                album: {
                    select: {
                        title: true,
                        front_cover_reference: true,
                        back_cover_reference: true
                    }
                }
            }
        }),
        database.songRating.aggregate({
            where: {song_id},
            _avg: {
                score: true
            },
            _count: {
                song_id: true
            }
        })
    ]).then(([song, {_avg, _count}]) => {
        if(!song){
            return Promise.reject({status: 404, message: "Song not found"});
        }
        song.average_rating = Math.round(parseFloat(_avg.score)*10)/10;
        song.rating_count = _count.song_id;
        return song;
    })
}

function uploadSong(album_id, song){
    const data = {...song};

    for(const key in data){
        if(!["user_id", "title", "description", "reference"].includes(key)){
            delete data[key];
        }
        if(key === "album_id"){
            return Promise.reject({status: 400, message: "Bad request"})
        }
    }

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

function editSong(stringifiedSongID, body){
    const song_id = parseInt(stringifiedSongID);
    const data = {...body};

    if(data.user_id || data.album_id || data.song_id){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    for(const key in data){
        if(!["title", "reference", "is_featured", "description"].includes(key)){
            delete data[key];
        }
    }

    return database.song.update({
        where: {
            song_id
        },
        data
    })
}

function removeSong(stringifiedSongID){
    const song_id = parseInt(stringifiedSongID);
    
    return database.songRating.deleteMany({
        where: {
            song_id
        }
    }).then(() => {
        return database.comment.deleteMany({
            where: {
                song_id
            }
        })
    }).then(() => {
        return database.song.delete({
            where: {
                song_id
            }
        })
    })
}

module.exports = { fetchSongs, fetchSongById, uploadSong, editSong, removeSong }