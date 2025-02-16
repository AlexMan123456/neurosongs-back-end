const database = require("../../client")

function fetchAlbumsFromUser(username){
    return database.album.findMany({
        where: {username}
    })
}

module.exports = { fetchAlbumsFromUser };