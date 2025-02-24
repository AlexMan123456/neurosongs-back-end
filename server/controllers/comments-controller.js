const { fetchCommentsFromContent } = require("../models/comments-model");

function getCommentsFromContent(request, response, next){
    fetchCommentsFromContent(request.params.song_id).then((data) => {
        response.status(200).send(data);
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getCommentsFromContent };