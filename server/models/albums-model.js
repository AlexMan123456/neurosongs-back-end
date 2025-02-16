const database = require("../../client")

function fetchAlbumsFromUser(username){
    return database.album.findMany({
        where: {username}
    })
}

function uploadAlbum(username, album){
    const data = {...album}
    data.username = username

    for(const key in data){
        if(!["username", "title", "front_cover_reference", "back_cover_reference"].includes(key)){
            delete data[key];
        }
    }

    return database.album.create({data})
}

module.exports = { fetchAlbumsFromUser, uploadAlbum };