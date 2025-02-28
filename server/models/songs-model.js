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
        database.comment.aggregate({
            where: {song_id},
            _avg: {
                rating: true
            }
        })
    ]).then(([song, {_avg}]) => {
        if(!song){
            return Promise.reject({status: 404, message: "Song not found"});
        }
        song.average_rating = Math.round(parseFloat(_avg.rating)*10)/10;
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

module.exports = { fetchSongs, fetchSongById, uploadSong, editSong }