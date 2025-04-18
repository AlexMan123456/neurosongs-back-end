const { stripIndents } = require("common-tags");
const database = require("../../prisma/client");

async function fetchCommentsFromContent(params){
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
    request.include[params.song_id ? "song" : "album"] = true;

    const comments = await database.comment.findMany(request);
    for(const comment of comments){
        const {_count} = await database.comment.aggregate({
            where: {
                replying_to_id: comment.comment_id
            },
            _count: {
                replying_to_id: true
            }
        })
        comment.reply_count = _count.replying_to_id
    }
    return comments
}

async function fetchCommentById(stringifiedCommentID){
    const comment_id = parseInt(stringifiedCommentID);

    const chosenComment = await database.comment.findUnique({
        where: {
            comment_id
        },
        include: {
            song: {
                select: {
                    title: true
                }
            },
            album: {
                select: {
                    title: true
                }
            },
            replying_to: {
                include: {
                    song: true,
                    album: true
                }
            },
            author: {
                select: {
                    artist_name: true,
                    username: true,
                    profile_picture: true
                }
            }
        }
    });

    if(!chosenComment){
        return Promise.reject({status: 404, message: "Comment not found"})
    }

    if (!chosenComment.song_id) {
        delete chosenComment.song_id;
        delete chosenComment.song;
    }
    if (!chosenComment.album_id) {
        delete chosenComment.album_id;
        delete chosenComment.album;
    }
    if (!chosenComment.replying_to_id) {
        delete chosenComment.replying_to_id;
        delete chosenComment.replying_to;
        return {comment: chosenComment};
    }
    
    // If the code gets past this point, it is a reply and shall be treated as such

    const contentType = chosenComment.replying_to.song ? "song" : "album";

    const parentComment = await database.comment.findUnique({
        where: {
            comment_id: chosenComment.replying_to_id
        },
        include: {
            replies: {
                include: {
                    song_id: false,
                    album_id: false,
                    author: {
                        select: {
                            artist_name: true,
                            username: true,
                            profile_picture: true
                        }
                    },
                    replying_to: {
                        select: {
                            [`${contentType}_id`]: true
                        }
                    }
                }
            },
            [contentType]: {
                select: {
                    title: true
                }
            },
            author: {
                select: {
                    artist_name: true,
                    username: true,
                    profile_picture: true
                }
            }
        },
        omit: {
            [`${contentType === "song" ? "album" : "song"}_id`]: true,
            replying_to_id: true
        }
    })

    const replyIDsFromParentComment = parentComment.replies.map((reply) => {
        return reply.comment_id
    })

    const chosenReplyIndex = replyIDsFromParentComment.indexOf(comment_id);
    const chosenReply = parentComment.replies[chosenReplyIndex];

    return {comment: parentComment, reply: chosenReply}
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
                replying_to: {
                    include: {
                        song: true,
                        album: true
                    }
                },
                album_id: false,
                song_id: false
            }
        })
    })
}

async function uploadComment(params, body){
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
    const contentType = params.song_id ? "song" : "album";

    const comment = await database.comment.create({
        data,
        include: {
            author: {
                select: {
                    artist_name: true,
                    username: true,
                    profile_picture: true
                }
            },
            [params.song_id ? "album_id" : "song_id"]: false,
            [contentType]: true
        }
    });

    const notifyList = await database.notifyList.createManyAndReturn({
        data: [
            {
                user_id: comment.user_id,
                comment_id: comment.comment_id
            },
            {
                user_id: comment[contentType].user_id,
                comment_id: comment.comment_id
            }
        ],
        skipDuplicates: true
    })

    await database.commentNotification.createMany({
        data: notifyList.map((item) => {
            return {
                sender_id: data.user_id,
                receiver_id: item.user_id,
                comment_id: comment.comment_id,
                message: stripIndents(`${comment.author.artist_name} (@${comment.author.username}) has commented on the ${contentType}, _${comment[contentType].title}_:
                '${comment.body}'`)
            }
        }).filter((item) => {
            return item.sender_id !== item.receiver_id
        })
    })
    
    comment.reply_count = 0;
    return comment;
}

async function uploadCommentReply(stringifiedID, body){
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

    const comment = await database.comment.findUnique({
        where: {
            comment_id: data.replying_to_id
        }
    });

    if (!comment) {
        return Promise.reject({ status: 404, message: "Comment not found" });
    }
    const reply = await database.comment.create({
        data,
        include: {
            author: {
                select: {
                    artist_name: true,
                    username: true,
                    profile_picture: true
                }
            },
            replying_to: {
                include: {
                    song: true,
                    album: true,
                }
            },
            song_id: false,
            album_id: false
        }
    });
    const userFromNotifyList = await database.notifyList.findUnique({
        where: {
            user_id_comment_id: {
                user_id: reply.user_id,
                comment_id: comment.comment_id
            }
        }
    })

    if(!userFromNotifyList){
        await database.notifyList.create({
            data: {
                user_id: reply.user_id,
                comment_id: comment.comment_id
            }
        })
    }
    
    const notifyList = await database.notifyList.findMany({
        where: {
            comment_id: comment.comment_id
        }
    })

    await database.commentNotification.createMany({
        data: notifyList.map((item) => {
            return {
                sender_id: data.user_id,
                receiver_id: item.user_id,
                comment_id: reply.comment_id,
                message: stripIndents(
                    `${reply.author.artist_name} (@${reply.author.username}) has replied to your comment:
                    '${reply.body}'`
                )
            }
        }).filter((item) => {
            return item.sender_id !== item.receiver_id
        })
    })

    return reply
}

async function editComment(stringifiedCommentID, body){
    const comment_id = parseInt(stringifiedCommentID);
    const data = {...body};

    for(const key in data){
        if(!["body", "rating"].includes(key)){
            delete data[key];
        }
        if(["user_id", "song_id", "album_id", "replying_to_id"].includes(key)){
            return Promise.reject({status: 400, message: "Bad request"})
        }
    }

    const comment = await database.comment.update({
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
    })

    if(comment.song_id){
        delete comment.album_id;
        delete comment.replying_to_id;
    } else if(comment.album_id){
        delete comment.song_id;
        delete comment.replying_to_id;
    } else if(comment.replying_to_id){
        delete comment.album_id;
        delete comment.song_id;
    }

    if(comment.song_id || comment.album_id){
        const {_count} = await database.comment.aggregate({
            where: {
                replying_to_id: comment.comment_id
            },
            _count: {
                replying_to_id: true
            }
        })
        comment.reply_count = _count.replying_to_id
    }

    return comment;

}

function removeComment(stringifiedCommentID){
    const comment_id = parseInt(stringifiedCommentID);
    return database.comment.delete({ where: { comment_id } });
}

module.exports = { fetchCommentsFromContent, fetchCommentById, uploadComment, editComment, removeComment, fetchCommentReplies, uploadCommentReply };