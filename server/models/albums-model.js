const database = require("../../client")

function fetchAlbumsFromUser(username){
    return database.album.findMany({
        where: {username}
    })
}

function uploadAlbum(username, album){
    const data = {...album}
    data.username = username
    return database.album.create({data})
}

module.exports = { fetchAlbumsFromUser, uploadAlbum };