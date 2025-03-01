const database = require("../client")
const ENV = process.env.NODE_ENV ?? "development"

async function seed({userData, songData, albumData, commentData, songRatingData, albumRatingData}){
    try {
        if(ENV === "test"){
            await database.$executeRaw`TRUNCATE songs RESTART IDENTITY CASCADE`
            await database.$executeRaw`TRUNCATE albums RESTART IDENTITY CASCADE`
            await database.user.deleteMany({})
        }
        await database.user.createMany({
            data: userData
        })
        await database.album.createMany({
            data: albumData
        })
        await database.song.createMany({
            data: songData
        })
        if(commentData){
            await database.comment.createMany({
                data: commentData
            })
        }
        if(songRatingData){
            await database.songRating.createMany({
                data: songRatingData
            })
        }
        if(albumRatingData){
            await database.albumRating.createMany({
                data: albumRatingData
            })
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports = seed