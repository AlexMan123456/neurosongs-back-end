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
        return {comments: comments.map((comment) => {
            comment.rating = parseFloat(comment.rating);
            return comment;
        }), average_rating: Math.round(parseFloat(_avg.rating)*10)/10};
    })
}

module.exports = { fetchCommentsFromContent };