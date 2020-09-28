var express = require('express');
var router = express.Router();
var config=require('../configFB');


const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

router.post("/sendFB", (req, res) => {
  const registrationToken = req.body.token;
  var titulo =req.body.title;
  var msn =req.body.body;
  const options = notification_options;
  const message = {
    notification: {
      title: titulo,
      body: msn,
    },
  };
  config.admin
    .messaging()
    .sendToDevice(registrationToken, message, options)
    .then((response) => {
      res.status(200).send("Notification sent successfully");
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;