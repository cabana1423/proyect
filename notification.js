const admin=require("firebase-admin");

function initFirebase(){
    const serviceAccount =require(__dirname + '/keys/come-ya-38a5c-firebase-adminsdk-ml5vd-734189bf4c.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    
}
initFirebase();

function sendPushToOneUser(notification){
    const message={
        token:notification.tokenId,
        data:{
            titulo:notification.titulo,
            mensaje:notification.mensaje
        }
    }
    sendMessage(message);
}
function sendPushTotopic(notification){
    const message={
        topic: notification.topic,
        data:{
            titulo:notification.titulo,
            mensaje:notification.mensaje
        }
    }
    sendMessage(message);
}

module.exports = {sendPushToOneUser,sendPushTotopic}

function sendMessage(message){
    admin.messaging.send(message)
        .then((response) => {
            console.log("sussefull sent message",response);   
        }).catch((error) => {
            console.log("error sending message",console.error);   
        });
}
