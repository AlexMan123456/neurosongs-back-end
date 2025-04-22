const { fetchLinksFromUser, uploadLink, editLink } = require("../models/links-model");
const { fetchUserById } = require("../models/users-model");

function getLinksFromUser(request, response, next){
    fetchUserById(request.params.user_id).then(() => {
        return fetchLinksFromUser(request.params.user_id)
    }).then((links) => {
        response.status(200).send({links});
    }).catch(next)
}

function postLink(request, response, next){
    fetchUserById(request.params.user_id).then(() => {
        return uploadLink(request.params.user_id, request.body);
    }).then((link) => {
        response.status(201).send({link})
    }).catch(next)
}

function patchLink(request, response, next){
    return editLink(request.params.link_id, request.body).then((link) => {
        response.status(200).send({link});
    }).catch((error) => {
        next(error)
    })
}

module.exports = { getLinksFromUser, postLink, patchLink }