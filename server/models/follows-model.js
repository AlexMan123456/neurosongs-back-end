const database = require("../../client")

function uploadFollow(follower_id, following_id){
    if(follower_id === following_id){
        return Promise.reject({status: 400, message: "Look at you, trying to follow yourself! Do you not have any friends?"})
    }

    return database.follow.create({
        data: {
            follower_id,
            following_id
        },
        include: {
            follower: {
                select: {
                    user_id: true,
                    username: true,
                    artist_name: true,
                    profile_picture: true
                }
            },
            following: {
                select: {
                    user_id: true,
                    username: true,
                    artist_name: true,
                    profile_picture: true
                }
            }
        }
    })
}

module.exports = { uploadFollow };