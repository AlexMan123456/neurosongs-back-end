const database = require("../client")
const ENV = process.env.NODE_ENV ?? "development"

async function seed({userData, songData, albumData, commentData, songRatingData, albumRatingData, followData, notificationData}){
    try {
        if(ENV === "test"){
            await database.$executeRaw`TRUNCATE songs RESTART IDENTITY CASCADE`
            await database.$executeRaw`TRUNCATE albums RESTART IDENTITY CASCADE`
            await database.$executeRaw`TRUNCATE comments RESTART IDENTITY CASCADE`
            await database.songRating.deleteMany({});
            await database.albumRating.deleteMany({});
            await database.follow.deleteMany({});
            await database.user.deleteMany({});
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
        if(followData){
            await database.follow.createMany({
                data: followData
            })
        }
        if(notificationData){
            await database.notification.createMany({
                data: notificationData
            })
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports = seed