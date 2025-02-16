const database = require("../../client")

function fetchAllUsers(){
    return database.user.findMany({})
}

function fetchUserByUsername(username){
    return database.user.findUnique({
        where: {username}
    }).then((user) => {
        if(!user){
            return Promise.reject({status: 404, message: "User not found"});
        }
        return user
    })
}

function uploadUser(data){
    for(const key in data){
        if(!["username", "global_name", "email", "is_verified"].includes(key)){
            delete data[key]
        }
    }

    if(data.username){
        if(data.username.includes(" ")){
            return Promise.reject({status: 400, message: "Invalid username"});
        }
    }

    if(data.email){
        if(!data.email.includes("@")){
            return Promise.reject({status: 400, message: "Invalid email"});
        }
    }

    return database.user.create({
        data
    })
}

module.exports = { fetchAllUsers, fetchUserByUsername, uploadUser }