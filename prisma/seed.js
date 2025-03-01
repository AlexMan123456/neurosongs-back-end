const database = require("../client")
const { ratingData } = require("./test-data")
const ENV = process.env.NODE_ENV ?? "development"

async function seed({userData, songData, albumData, commentData}){
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
        if(ratingData){
            await database.rating.createMany({
                data: ratingData
            })
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports = seed