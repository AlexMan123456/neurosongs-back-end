const database = require("../../client")

function fetchAlbums(queries){
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

    return database.album.findMany(request)
}

function fetchAlbumsFromUser(user_id){
    return database.album.findMany({
        where: {user_id},
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

function fetchAlbumById(stringifiedAlbumID){
    const album_id = parseInt(stringifiedAlbumID);
    return database.album.findUnique({
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
                    }
                }
            },
            artist: {
                select: {
                    username: true,
                    artist_name: true
                }
            }
        }
    }).then((album) => {
        if(!album){
            return Promise.reject({status: 404, message: "Album not found"});
        }
        return album;
    })
}

function uploadAlbum(user_id, album){
    const data = {...album};
    data.user_id = user_id;

    for(const key in data){
        if(!["user_id", "title", "front_cover_reference", "back_cover_reference"].includes(key)){
            delete data[key];
        }
    }

    if(data.front_cover_reference){
        if(data.front_cover_reference.includes("/") || !data.front_cover_reference.includes(".")){
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

module.exports = { fetchAlbums, fetchAlbumsFromUser, fetchAlbumById, uploadAlbum };