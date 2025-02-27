const database = require("../../client")

function fetchAlbums(queries){
    const request = {
        include: {
            artist: {
                select: {
                    username: true,
                    artist_name: true
                }
            },
            description: false
        }
    }

    if(queries.user_id){
        const {user_id} = queries;
        request.where = {user_id};
    }

    if(queries.is_featured){
        if(queries.is_featured.toLowerCase() !== "true" && queries.is_featured.toLowerCase() !== "false"){
            return Promise.reject({status: 400, message: "Bad request"});
        }
        const is_featured = queries.is_featured.toLowerCase() === "true";
        request.where = {is_featured};
    }

    return database.album.findMany(request)
}

function fetchAlbumById(stringifiedAlbumID){
    const album_id = parseInt(stringifiedAlbumID);
    return Promise.all([
        database.album.findUnique({
            where: {
                album_id
            },
            include: {
                songs: {
                    select: {
                        song_id: true,
                        title: true,
                        reference: true,
                        artist: {
                            select: {
                                username: true,
                                artist_name: true
                            }
                        },
                        created_at: true,
                    },
                    orderBy: {
                        created_at: "asc"
                    }
                },
                artist: {
                    select: {
                        username: true,
                        artist_name: true
                    }
                }
            }
        }),
        database.comment.aggregate({
            where: {
                album_id
            },
            _avg: {
                rating: true
            }
        })
    ]).then(([album, {_avg}]) => {
        if(!album){
            return Promise.reject({status: 404, message: "Album not found"});
        }
        album.average_rating = Math.round(parseFloat(_avg.rating)*10)/10;
        return album;
    })
}

function uploadAlbum(album){
    const data = {...album};

    for(const key in data){
        if(!["user_id", "title", "front_cover_reference", "back_cover_reference", "description"].includes(key)){
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

    for(const key in data){
        if(!["title", "front_cover_reference", "back_cover_reference", "description"].includes(key)){
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

module.exports = { fetchAlbums, fetchAlbumById, uploadAlbum, editAlbum };