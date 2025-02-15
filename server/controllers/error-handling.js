function customErrors(error, request, response, next){
    console.log(error)
    if(error.status && error.message){
        return response.status(error.status).send({message: error.message});
    }
    next(err)
}

module.exports = { customErrors };