const database = require("../../client")

function fetchCommentsFromContent(params){
    const request = {
        where: {},
        include: {
            author: {
                select: {
                    artist_name: true,
                    username: true,
                    profile_picture: true
                }
            }
        }
    }

    request.where[params.song_id ? "song_id" : "album_id"] = parseInt(params.song_id ?? params.album_id);


    return Promise.all([
        database.comment.findMany(request),
        database.comment.aggregate({
            _avg: {
                rating: true
            }
        })
    ]).then(([comments, {_avg}]) => {
        return {
            comments: comments.map((comment) => {
                comment.rating = parseFloat(comment.rating);
                return comment;
            }),
            average_rating: Math.round(parseFloat(_avg.rating)*10)/10
        };
    })
}

function uploadComment(params, data){
    for(const key in data){
        if(!["user_id", "body", "rating"].includes(key)){
            delete data[key];
        }
        if(key === "song_id" || key === "album_id"){
            return Promise.reject({status: 400, message: "Bad request"});
        }
    }

    if(data.rating < 1 || data.rating > 10){
        return Promise.reject({status: 400, message: "Invalid rating"});
    }

    const {song_id} = params;
    data.song_id = parseInt(song_id);

    return database.comment.create({data}).then((comment) => {
        comment.rating = parseFloat(comment.rating);
        return comment;
    });

}

module.exports = { fetchCommentsFromContent, uploadComment };