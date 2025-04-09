const { Visibility } = require("@prisma/client");
const database = require("../../prisma/client")

function fetchSongs(queries, signedInUserID){
    const request = {
        where: {
            visibility: Visibility.public
        },
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
        const {user_id} = queries
        request.where.user_id = user_id;
        if(user_id === signedInUserID){
            delete request.where.visibility;
        }
    }

    if(queries.is_featured){
        if(queries.is_featured.toLowerCase() !== "true" && queries.is_featured.toLowerCase() !== "false"){
            return Promise.reject({status: 400, message: "Bad request"});
        }
        const is_featured = queries.is_featured.toLowerCase() === "true";
        request.where.is_featured = is_featured;
    }

    if(queries.search_query){
        request.where.title = {
            contains: queries.search_query, 
            mode: "insensitive"
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

function uploadSong(stringifiedAlbumID, song){
    const album_id = parseInt(stringifiedAlbumID);
    if(song.album_id || song.index){
        return Promise.reject({status: 400, message: "Bad request"});
    }
    const data = {...song, album_id};

    for(const key in data){
        if(!["user_id", "album_id", "title", "description", "reference", "visibility"].includes(key)){
            delete data[key];
        }
    }

    if(data.reference){
        if(data.reference.includes("/") || !data.reference.includes(".")){
            return Promise.reject({status: 400, message: "Invalid file name"})
        }
    }

    return database.album.findUnique({
        where: {
            album_id
        },
        include: {
            songs: true
        }
    }).then((album) => {
        if(!album){
            return Promise.reject({status: 404, message: "Album not found"});
        }

        data.index = album.songs.length + 1;
        
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
    })

}

function editSong(stringifiedSongID, body){
    const song_id = parseInt(stringifiedSongID);
    const data = {...body};

    if(data.user_id || data.album_id || data.song_id){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    for(const key in data){
        if(!["title", "reference", "is_featured", "description", "index"].includes(key)){
            delete data[key];
        }
    }

    return database.song.findUnique({
        where: {
            song_id
        }
    }).then((song) => {
        if(!song){
            return Promise.reject({status: 404, message: "Song not found"})
        }
        return database.album.findUnique({
            where: {
                album_id: song.album_id
            },
            include: {
                songs: true
            }
        })
    }).then((album) => {
        if(!album){
            return Promise.reject({status: 404, message: "Album not found"});
        }
        if(data.index > album.songs.length){
            return Promise.reject({status: 400, message: "Index out of bounds"});
        }
        return database.song.update({
            where: {
                song_id
            },
            data
        })
    })
}

function removeSong(stringifiedSongID){
    const song_id = parseInt(stringifiedSongID);
    
    return database.songRating.deleteMany({
        where: {
            song_id
        }
    }).then(() => {
        return database.comment.findMany({
            where: {
                song_id
            },
            select: {
                comment_id: true
            }
        })
    }).then((comments) => {
        return Promise.all(
            comments.map((comment) => {
                return database.commentNotification.deleteMany({
                    where: {
                        comment_id: comment.comment_id
                    }
                })
            })
        )
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