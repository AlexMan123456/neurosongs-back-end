const database = require("../prisma/client")
const ENV = process.env.NODE_ENV ?? "development"

async function seed({userData, songData, albumData, commentData, songRatingData, albumRatingData, followData, commentNotificationData, linkData}){
    try {
        if(ENV === "test"){
            await database.$executeRaw`TRUNCATE songs RESTART IDENTITY CASCADE`
            await database.$executeRaw`TRUNCATE albums RESTART IDENTITY CASCADE`
            await database.$executeRaw`TRUNCATE comments RESTART IDENTITY CASCADE`
            await database.$executeRaw`TRUNCATE links RESTART IDENTITY CASCADE`
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
            const commentsFromDatabase = await database.comment.createManyAndReturn({
                data: commentData
            })
            await database.notifyList.createMany({
                data: commentsFromDatabase.map((comment) => {
                    return {
                        user_id: comment.user_id,
                        comment_id: comment.comment_id
                    }
                })
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
        if(commentNotificationData){
            await database.commentNotification.createMany({
                data: commentNotificationData
            })
        }
        if(linkData){
            await database.link.createMany({
                data: linkData
            })
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports = seed