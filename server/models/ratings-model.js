const database = require("../../client");

function fetchRating(contentType, content_id, user_id){
    const contentTypeSingular = {
        albums: "album",
        songs: "song"
    }[contentType];
    
    if(!contentTypeSingular){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    return database[`${contentTypeSingular}Rating`].findUnique({
        where: {
            [`user_id_${contentTypeSingular}_id`]: {
                user_id,
                [`${contentTypeSingular}_id`]: parseInt(content_id)
            }
        }
    }).then((rating) => {
        if(!rating){
            return {}
        }
        rating.score = parseFloat(rating.score);
        return rating;
    })
}

function uploadRating(contentID, data, contentType){
    if(data.song_id || data.album_id){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    for(const key in data){
        if(!["user_id", "score", "is_visible"].includes(key)){
            delete data[key]
        }
    }

    if(data.score > 10 || data.score < 1){
        return Promise.reject({status: 400, message: "Invalid score"});
    }
    
    data[`${contentType}_id`] = parseInt(contentID);

    return database[`${contentType}Rating`].create({data}).then((rating) => {
        rating.score = parseFloat(rating.score);
        return rating;
    })
}

function updateRating(contentType, content_id, user_id, body){
    const contentTypeSingular = {
        albums: "album",
        songs: "song"
    }[contentType];
    
    if(!contentTypeSingular){
        return Promise.reject({status: 400, message: "Bad request"});
    }
    
    const data = {...body}

    if(data.user_id || data.song_id || data.album_id){
        return Promise.reject({status: 400, message: "Bad request"})
    }

    if(data.score > 10 || data.score < 1){
        return Promise.reject({status: 400, message: "Invalid score"});
    }

    for(const key in data){
        if(!["score", "is_visible"].includes(key)){
            delete data[key];
        }
    }

    return database[`${contentTypeSingular}Rating`].update({
        where: {
            [`user_id_${contentTypeSingular}_id`]: {
                user_id,
                [`${contentTypeSingular}_id`]: parseInt(content_id)
            }
        },
        data
    }).then((rating) => {
        rating.score = parseFloat(rating.score);
        return rating;
    })
}

function removeRating(user_id, content_id, contentType){
    const contentTypeSingular = {
        albums: "album",
        songs: "song"
    }[contentType];

    if(!contentTypeSingular){
        return Promise.reject({status: 400, message: "Bad request"})
    }

    return database[`${contentTypeSingular}Rating`].delete({
        where: {
            [`user_id_${contentTypeSingular}_id`]: {
                user_id,
                [`${contentTypeSingular}_id`]: parseInt(content_id)
            }
        }
    })
}

module.exports = { fetchRating, uploadRating, updateRating, removeRating }