const database = require("../../client");

function uploadNotification(body){
    const data = {...body};

    if(data.is_viewed || data.created_at){
        return Promise.reject({status: 400, message: "Bad request"});
    }

    for(const key in data){
        if(!["sender_id", "receiver_id", "comment_id", "message"].includes(key)){
            delete data[key];
        }
    }

    return database.comment.findUnique({
        where: {
            comment_id: data.comment_id
        },
        include: {
            song: true,
            album: true,
            replying_to: true
        }
    }).then((comment) => {
        if(!comment){
            return Promise.reject({status: 404, message: "Comment not found"});
        }

        const contentType = comment.song_id ? "song" : (comment.album_id ? "album" : "comment")

        if(contentType === "song" || contentType === "album"){
            if(comment.user_id !== data.sender_id || comment[contentType].user_id !== data.receiver_id){
                return Promise.reject({status: 400, message: "Bad request"})
            }
        } else if(contentType === "comment") {
            if(comment.user_id !== data.sender_id || comment.replying_to.user_id !== data.receiver_id){
                return Promise.reject({status: 400, message: "Bad request"})
            }
        }

        return database.commentNotification.create({
            data
        })
    })
}

function updateNotification(stringifiedNotificationID){
    const comment_notification_id = parseInt(stringifiedNotificationID);
    return database.commentNotification.findUnique({
        where: {
            comment_notification_id
        },
        select: {
            is_viewed: true
        }
    }).then((notification) => {
        if(!notification){
            return Promise.reject({status: 404, message: "Notification not found"})
        }
        return database.commentNotification.update({
            where: {
                comment_notification_id
            },
            data: {
                is_viewed: !notification.is_viewed
            }
        })
    })
    
}

module.exports = { uploadNotification, updateNotification };