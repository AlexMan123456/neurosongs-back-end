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

function uploadUser(user){
    const data = {...user}
    for(const key in data){
        if(!["username", "artist_name", "email", "is_verified"].includes(key)){
            delete data[key]
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

    return database.user.create({
        data
    })
}

module.exports = { fetchAllUsers, fetchUserByUsername, uploadUser }