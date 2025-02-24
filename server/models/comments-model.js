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
    request.include[params.song_id ? "album_id" : "song_id"] = false;

    return database.comment.findMany(request).then((comments) => {
        return comments.map((comment) => {
            comment.rating = parseFloat(comment.rating);
            return comment;
        })
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

    data[params.song_id ? "song_id" : "album_id"] = parseInt(params.song_id ?? params.album_id);

    return database.comment.create({
        data,
        include: {
            author: {
                select: {
                    artist_name: true,
                    username: true,
                    profile_picture: true
                }
            },
            [params.song_id ? "album_id" : "song_id"]: false
        }
    }).then((comment) => {
        comment.rating = parseFloat(comment.rating);
        return comment;
    });
}

function editComment(stringifiedCommentID, data){
    const comment_id = parseInt(stringifiedCommentID)

    for(const key in data){
        if(!["body", "rating"].includes(key)){
            delete data[key];
        }
        if(["user_id", "song_id", "album_id"].includes(key)){
            return Promise.reject({status: 400, message: "Bad request"})
        }
    }

    return database.comment.update({
        where: {
            comment_id
        },
        data,
        include: {
            author: {
                select: {
                    artist_name: true,
                    username: true,
                    profile_picture: true
                }
            }
        }
    }).then((comment) => {
        comment.rating = parseFloat(comment.rating);
        if(comment.song_id){
            delete comment.album_id;
        } else if(comment.album_id){
            delete comment.song_id;
        }
        return comment;
    })
}

function removeComment(stringifiedCommentID){
    const comment_id = parseInt(stringifiedCommentID);
    return database.comment.delete({ where: { comment_id } });
}

module.exports = { fetchCommentsFromContent, uploadComment, editComment, removeComment };