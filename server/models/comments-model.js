const database = require("../../client")

function fetchCommentsFromContent(stringifiedSongID){
    const song_id = parseInt(stringifiedSongID);
    console.log(song_id)
    return Promise.all([
        database.comment.findMany({
            where: {
                song_id
            },
            include: {
                author: {
                    select: {
                        artist_name: true,
                        username: true,
                        profile_picture: true
                    }
                }
            }
        }),
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