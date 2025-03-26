const fetchEndpoints = require("../models/endpoints-model")

function getEndpoints(request, response, next){
    const endpoints = fetchEndpoints()
    response.status(200).send({endpoints})
}

module.exports = getEndpoints