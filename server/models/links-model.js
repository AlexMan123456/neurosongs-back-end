const database = require("../../prisma/client");
const isURL = require("../../utils/is-url");

function fetchLinksFromUser(user_id){
    return database.link.findMany({
        where: {
            user_id
        }
    })
}

function uploadLink(user_id, link){
    const data = {...link};

    if(data.user_id){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    for(const key in data){
        if(!["name", "url"].includes(key)){
            delete data[key];
        }
    }

    if(!isURL(data.url)){
        return Promise.reject({status: 400, message: "Invalid URL"})
    }

    data.user_id = user_id;

    return database.link.create({
        data
    })
}

function editLink(stringifiedLinkID, link){
    const link_id = parseInt(stringifiedLinkID);
    const data = {...link};

    if(data.user_id){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    if(data.url && !isURL(data.url)){
        return Promise.reject({status: 400, message: "Invalid URL"})
    }

    for(const key in data){
        if(!["name", "url"].includes(key)){
            delete data[key];
        }
    }
    
    return database.link.update({
        where: {
            link_id
        },
        data
    })
}

module.exports = { fetchLinksFromUser, uploadLink, editLink }