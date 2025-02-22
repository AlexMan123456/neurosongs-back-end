const database = require("../../client")

function fetchAllUsers(){
    return database.user.findMany({})
}

function fetchUserById(user_id){
    return database.user.findUnique({
        where: {user_id}
    }).then((user) => {
        if(!user){
            return Promise.reject({status: 404, message: "User not found"});
        }
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
        if(data.profile_picture.includes("/") || !data.profile_picture.includes(".")){
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
        if(!["username", "email", "artist_name", "description", "profile_picture"].includes(key)){
            delete data[key];
        }
    }

    if(data.profile_picture){
        if(data.profile_picture.includes("/") || !data.profile_picture.includes(".")){
            return Promise.reject({status: 400, message: "Invalid file name"});
        }
    }

    return database.user.update({
        where: {user_id},
        data
    })
}

module.exports = { fetchAllUsers, fetchUserById, uploadUser, updateUser }