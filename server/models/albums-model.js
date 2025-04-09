const { Visibility } = require("@prisma/client");
const database = require("../../prisma/client")

function fetchAlbums(queries, signedInUserID){
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
            songs: {
                where: {
                    visibility: Visibility.public
                }
            },
            description: false
        }
    }

    if(queries.user_id){
        const {user_id} = queries;
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

    return database.album.findMany(request)
}

function fetchAlbumById(stringifiedAlbumID, signedInUserID){
    const album_id = parseInt(stringifiedAlbumID);
    const albumRequest = {
        where: {
            album_id
        },
        include: {
            songs: {
                include: {
                    artist: true,
                    comments: true
                },
                orderBy: {
                    index: "asc"
                }
            },
            artist: {
                select: {
                    username: true,
                    artist_name: true
                }
            }
        }
    }

    return database.album.findUnique({
        where: {
            album_id
        }
    }).then((album) => {
        if(!album){
            return Promise.reject({status: 404, message: "Album not found"});
        }
        if((album.visibility !== Visibility.public && album.visibility !== Visibility.unlisted) && album.user_id !== signedInUserID){
            return Promise.reject({status: 401, message: "Unauthorised"});
        }
        if(album.user_id !== signedInUserID){
            albumRequest.include.songs.where = {visibility: Visibility.public}
        }
        return Promise.all([
            database.album.findUnique(albumRequest),
            database.albumRating.aggregate({
                where: {
                    album_id
                },
                _avg: {
                    score: true
                },
                _count: {
                    album_id: true
                }
            })
        ])
    }).then(([album, {_avg, _count}]) => {
        album.average_rating = Math.round(parseFloat(_avg.score)*10)/10;
        album.rating_count = _count.album_id;
        return album;
    })
}

function uploadAlbum(album){
    const data = {...album};

    for(const key in data){
        if(!["user_id", "title", "front_cover_reference", "back_cover_reference", "description", "visibility"].includes(key)){
            delete data[key];
        }
    }

    if(data.front_cover_reference){
        if(data.front_cover_reference.includes("/") || !data.front_cover_reference.includes(".") && data.front_cover_reference !== "Default"){
            return Promise.reject({status: 400, message: "Invalid file name"})
        }
    }

    if(data.back_cover_reference){
        if(data.back_cover_reference.includes("/") || !data.back_cover_reference.includes(".")){
            return Promise.reject({status: 400, message: "Invalid file name"})
        }
    }

    return database.album.create({
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

function editAlbum(stringifiedAlbumID, body){
    const album_id = parseInt(stringifiedAlbumID);
    const data = {...body};

    if(data.album_id || data.user_id){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    for(const key in data){
        if(!["title", "front_cover_reference", "back_cover_reference", "description", "visibility"].includes(key)){
            delete data[key];
        }
    }

    return database.album.update({
        where: {
            album_id
        },
        data
    })
}

function removeAlbum(stringifiedAlbumID){
    const album_id = parseInt(stringifiedAlbumID);
    return database.song.findMany({
        where: {
            album_id
        }
    }).then((songs) => {
        const promises = songs.map((song) => {
            return database.songRating.deleteMany({
                where: {
                    song_id: song.song_id
                }
            })
        })
        return Promise.all(promises)
    }).then(() => {
        return database.song.deleteMany({
            where: {
                album_id
            }
        })
    }).then(() => {
        return database.albumRating.deleteMany({
            where: {
                album_id
            }
        })
    }).then(() => {
        return database.comment.deleteMany({
            where: {
                album_id
            }
        })
    })
    .then(() => {
        return database.album.delete({
            where: {
                album_id
            }
        });
    })
}

async function resetIndex(stringifiedAlbumID){
    const album_id = parseInt(stringifiedAlbumID);
    
    const album = await database.album.findUnique({
        where: {
            album_id
        },
        include: {
            songs: true
        }
    })

    if(!album){
        return Promise.reject({status: 404, message: "Album not found"})
    }

    for(let i=0; i<album.songs.length; i++){
        await database.song.update({
            where: {
                song_id: album.songs[i].song_id
            },
            data: {
                index: i+1
            }
        })
    }

    return await database.album.findUnique({
        where: {
            album_id
        },
        include: {
            songs: true
        }
    })
}

module.exports = { fetchAlbums, fetchAlbumById, uploadAlbum, editAlbum, removeAlbum, resetIndex };