const database = require("../../client")

function fetchAllUsers(){
    return database.user.findMany({})
}

module.exports = { fetchAllUsers }