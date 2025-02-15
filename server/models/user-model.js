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
    return database.user.create({
        data
    })
}

module.exports = { fetchAllUsers, fetchUserByUsername, uploadUser }