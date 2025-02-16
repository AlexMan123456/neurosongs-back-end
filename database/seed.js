const database = require("../client")

async function seed({userData, songData, albumData}){
    try {
        await database.$executeRaw`TRUNCATE songs RESTART IDENTITY CASCADE`
        await database.$executeRaw`TRUNCATE albums RESTART IDENTITY CASCADE`
        await database.user.deleteMany({})
        await database.user.createMany({
            data: userData
        })
        await database.album.createMany({
            data: albumData
        })
        await database.song.createMany({
            data: songData
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports = seed