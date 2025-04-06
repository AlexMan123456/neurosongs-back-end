const database = require("../../prisma/client")

async function uploadFollow(follower_id, following_id){
    if(follower_id === following_id){
        return Promise.reject({status: 400, message: "Look at you, trying to follow yourself! Do you not have any friends?"})
    }

    const follow = await database.follow.create({
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
    
    const {_count} = await database.follow.aggregate({
        where: {
            following_id
        },
        _count: {
            follower_id: true
        }
    })

    follow.following.follower_count = _count.follower_id;
    return follow;
}

function removeFollow(follower_id, following_id){
    return database.follow.delete({
        where: {
            following_id_follower_id: {
                following_id, follower_id
            }
        }
    })
}

module.exports = { uploadFollow, removeFollow };