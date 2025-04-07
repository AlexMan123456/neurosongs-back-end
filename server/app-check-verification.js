const { appCheck } = require("../firebase-admin-config");
const ENV = process.env.NODE_ENV ?? "development";
require("dotenv").config({
    path: `${__dirname}/../.env.${ENV}`
})

function appCheckVerification(request, response, next){
    const appCheckToken = request.header("X-Firebase-AppCheck");
    if(!appCheckToken){
        return response.status(401).send({message: "App check unsuccessful"});
    }
    if(ENV === "test"){
        return appCheckToken === process.env.FIREBASE_TEST_HEADER ? next() : response.status(401).send({message: "App check unsuccessful"});
    }
    return appCheck.verifyToken(appCheckToken).then(() => {
        return next();
    }).catch((err) => {
        response.status(401).send({message: "App check unsuccessful"})
    })
}

module.exports = appCheckVerification