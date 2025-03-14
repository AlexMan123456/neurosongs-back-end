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

    return database.comment.findMany(request)
}

function fetchCommentReplies(stringifiedID){
    const replying_to_id = parseInt(stringifiedID);

    return database.comment.findUnique({
        where: {
            comment_id: replying_to_id
        }
    }).then((comment) => {
        if(!comment){
            return Promise.reject({status: 404, message: "Comment not found"});
        }

        return database.comment.findMany({
            where: {
                replying_to_id
            },
            include: {
                author: {
                    select: {
                        artist_name: true,
                        username: true,
                        profile_picture: true
                    }
                },
                album_id: false,
                song_id: false
            }
        })
    })
}

function uploadComment(params, body){
    const data = {...body}
    for(const key in data){
        if(!["user_id", "body"].includes(key)){
            delete data[key];
        }
        if(key === "song_id" || key === "album_id"){
            return Promise.reject({status: 400, message: "Bad request"});
        }
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
    })
}

function uploadCommentReply(stringifiedID, body){
    const data = {...body};
    
    for(const key in data){
        if(!["user_id", "body"].includes(key)){
            delete data[key];
        }
        if(key === "replying_to_id"){
            return Promise.reject({status: 400, message: "Bad request"});
        }
    }

    data.replying_to_id = parseInt(stringifiedID);

    return database.comment.findUnique({
        where: {
            comment_id: data.replying_to_id
        }
    }).then((comment) => {
        if(!comment){
            return Promise.reject({status: 404, message: "Comment not found"})
        }
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
                song_id: false,
                album_id: false
            }
        });
    })
    

}

function editComment(stringifiedCommentID, body){
    const comment_id = parseInt(stringifiedCommentID);
    const data = {...body};

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
    
    return database.commentNotification.deleteMany({
        where: {
            comment_id
        }
    }).then(() => {
        return database.comment.delete({ where: { comment_id } });
    })
}

module.exports = { fetchCommentsFromContent, uploadComment, editComment, removeComment, fetchCommentReplies, uploadCommentReply };