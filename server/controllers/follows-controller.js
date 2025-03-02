const { uploadFollow } = require("../models/follows-model");

function postFollow(request, response, next){
    uploadFollow(request.params.follower_id, request.params.following_id).then((follow) => {
        response.status(201).send({follow})
    }).catch((err) => {
        next(err);
    })
}

module.exports = { postFollow };