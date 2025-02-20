const database = require("../../client")

function fetchAlbums(queries){
    const request = {
        include: {
            artist: {
                select: {
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

function fetchAlbumsFromUser(username){
    return database.album.findMany({
        where: {username},
        include: {
            artist: {
                select: {
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
                    username: true,
                    title: true,
                    reference: true,
                    artist: {
                        select: {
                            artist_name: true
                        }
                    }
                }
            },
            artist: {
                select: {
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

function uploadAlbum(username, album){
    const data = {...album};
    data.username = username;

    for(const key in data){
        if(!["username", "title", "front_cover_reference", "back_cover_reference"].includes(key)){
            delete data[key];
        }
    }

    return database.album.create({
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

module.exports = { fetchAlbums, fetchAlbumsFromUser, fetchAlbumById, uploadAlbum };