const { uploadNotification, updateNotification } = require("../models/notifications-model");
const { fetchUserById } = require("../models/users-model");

function postNotification(request, response, next){
    fetchUserById(request.body.sender_id).then(() => {
        return fetchUserById(request.body.receiver_id)
    }).then(() => {
        return uploadNotification(request.body)
    }).then((notification) => {
        response.status(201).send({notification});
    }).catch((err) => {
        next(err);
    })
}

function patchNotification(request, response, next){
    updateNotification(request.params.notification_id).then((notification) => {
        response.status(200).send({notification});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { postNotification, patchNotification };