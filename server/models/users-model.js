const database = require("../../client")

function fetchUsers(queries){
    const request = {}

    if(queries.search_query){
        request.where = {
            OR: 
            [
                {
                    artist_name: {
                        contains: queries.search_query,
                        mode: "insensitive"
                    },
                },
                {
                    username: {
                        contains: queries.search_query,
                        mode: "insensitive"
                    }
                }
            ]
        }
    }

    return database.user.findMany(request);
}

function fetchUserById(user_id){
    return Promise.all([
        database.user.findUnique({
            where: {
                user_id
            },
            include: {
                followers: {
                    select: {
                        follower: {
                            select: {
                                user_id: true,
                                username: true,
                                artist_name: true,
                                profile_picture: true
                            }   
                        }
                    }
                },
                following: {
                    select: {
                        following: {
                            select: {
                                user_id: true,
                                username: true,
                                artist_name: true,
                                profile_picture: true
                            }   
                        }
                    }
                }
            }
        }),
        database.follow.aggregate({
            where: {
                follower_id: user_id
            },
            _count: {
                follower_id: true
            }
        }),
        database.follow.aggregate({
            where: {
                following_id: user_id
            },
            _count: {
                following_id: true
            }
        })
    ]).then(([user, followerAggregation, followingAggregation]) => {
        if(!user){
            return Promise.reject({status: 404, message: "User not found"});
        }
        user.follower_count = followerAggregation._count.follower_id;
        user.following_count = followingAggregation._count.following_id;
        return user
    })
}

function uploadUser(user){
    const data = {...user}
    for(const key in data){
        if(!["user_id", "username", "artist_name", "email", "description", "profile_picture", "date_of_birth"].includes(key)){
            delete data[key]
        }
    }

    if(data.user_id){
        if(data.user_id.includes("/")){
            return Promise.reject({status: 400, message: "Invalid user ID"})
        }
    }

    if(data.username){
        if(data.username.includes(" ")){
            return Promise.reject({status: 400, message: "Username must not contain spaces."});
        }
        if(data.username.includes("@")){
            return Promise.reject({status: 400, message: "Username must not contain @ symbol."});
        }
    }

    if(data.email){
        if(!data.email.includes("@")){
            return Promise.reject({status: 400, message: "Invalid email"});
        }
    }

    if(data.profile_picture){
        if((data.profile_picture.includes("/") || !data.profile_picture.includes(".")) && data.profile_picture !== "Default"){
            return Promise.reject({status: 400, message: "Invalid file name"})
        }
    }

    return database.user.create({
        data
    })
}

function updateUser(user_id, data){
    if(Object.keys(data).includes("user_id")){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    for(const key in data){
        if(!["username", "email", "artist_name", "description", "profile_picture", "date_of_birth"].includes(key)){
            delete data[key];
        }
    }

    if(data.profile_picture){
        if((data.profile_picture.includes("/") || !data.profile_picture.includes(".")) && data.profile_picture !== "Default"){
            return Promise.reject({status: 400, message: "Invalid file name"});
        }
    }

    return database.user.update({
        where: {user_id},
        data
    })
}

module.exports = { fetchUsers, fetchUserById, uploadUser, updateUser }