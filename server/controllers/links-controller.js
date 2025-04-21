const { fetchLinks } = require("../models/links.model");
const { fetchUserById } = require("../models/users-model");

function getLinks(request, response, next){
    fetchUserById(request.params.user_id).then(() => {
        return fetchLinks(request.params.user_id)
    }).then((links) => {
        response.status(200).send({links});
    }).catch(next)
}

module.exports = { getLinks }