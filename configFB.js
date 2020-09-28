let admin = require("firebase-admin");

let serviceAccount = require("./key/come-ya-38a5c-firebase-adminsdk-ml5vd-734189bf4c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://come-ya-38a5c.firebaseio.com",
});

module.exports.admin = admin;