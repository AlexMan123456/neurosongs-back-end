const database = require("../../prisma/client");

function fetchLinks(user_id){
    return database.link.findMany({
        where: {
            user_id
        }
    })
}

module.exports = { fetchLinks }