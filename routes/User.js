var express = require('express');
var router = express.Router();
var sha1 = require("sha1");
var USER = require("../database/user");
//REGISTER USER
router.post("/user", async(req, res) => {
  var userRest = req.body;
    if (userRest.password == null) {
      res.status(300).json({msn: "El password es necesario pra continuar con el registro"});
      return;
  }
  if (userRest.password.length < 6) {
      res.status(300).json({msn: "Es demasiado corto"});
      return;
  }
  if (!/[A-Z]+/.test(userRest.password)) {
      res.status(300).json({msn: "El password necesita una letra Mayuscula"});
      
      return;
  }
  if (!/[\$\^\@\&\(\)\{\}\#]+/.test(userRest.password)) {
      res.status(300).json({msn: "Necesita un caracter especial"});
      return;
  }
  userRest.password = sha1(userRest.password);
  var userDB = new USER(userRest);
  userDB.save((err, docs) => {
      if (err) {
          var errors = err.errors;
          var keys = Object.keys(errors);
          var msn = {};
          for (var i = 0; i < keys.length; i++) {
              msn[keys[i]] = errors[keys[i]].message;
          }
          res.status(500).json(msn);
          return;
      }
      res.status(200).json(docs);
      return;
  });
});
module.exports = router;
