const { fetchCommentsFromContent } = require("../models/comments-model");
const { fetchSongById } = require("../models/songs-model");

function getCommentsFromContent(request, response, next){
    fetchSongById(request.params.song_id).then(() => {
        return fetchCommentsFromContent(request.params.song_id)
    }).then((data) => {
        response.status(200).send(data);
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getCommentsFromContent };