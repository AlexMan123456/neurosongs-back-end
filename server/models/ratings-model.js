const database = require("../../client");

function uploadRating(contentID, data, contentType){
    if(data.song_id){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    for(const key in data){
        if(!["user_id", "score", "is_visible"].includes(key)){
            delete data[key]
        }
    }

    if(data.score > 10 || data.score < 1){
        return Promise.reject({status: 400, message: "Invalid score"})
    }
    
    data[`${contentType}_id`] = parseInt(contentID);

    return database[`${contentType}Rating`].create({data}).then((rating) => {
        rating.score = parseFloat(rating.score);
        return rating;
    })
}

module.exports = { uploadRating }