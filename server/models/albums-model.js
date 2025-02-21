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

    return database.album.findMany(request).then((albums) => {
        albums.forEach((album) => {
            delete album.user_id;
        })
        return albums;
    })
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
    }).then((albums) => {
        albums.forEach((album) => {
            delete album.user_id;
        })
        return albums;
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
        delete album.user_id;
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
    }).then((album) => {
        delete album.user_id;
        return album;
    });
}

module.exports = { fetchAlbums, fetchAlbumsFromUser, fetchAlbumById, uploadAlbum };