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
  if ((userRest.password.length < 6)) {
      res.status(300).json({msn: "passwword debe tener almenos 6 caracteres"});
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
router.post("/login", async(req, res) => {
    var body = req.body;
    if (body.email == null) {
        res.status(300).json({msn: "El email es necesario"});
             return;
    }
    if (body.password == null) {
        res.status(300).json({msn: "El password es necesario"});
        return;
    }
    var results = await USER.find({email: body.email, password: sha1(body.password)});
    if (results.length == 1) {
        res.status(200).json({msn: "Bienvenido al sistema " + body.email + " :) "});
        return;
    }
    res.status(200).json({msn: "Credenciales incorrectas"});
});
//GET user
router.get("/user", (req, res) => {
    var filter={};
    var params= req.query;
    var select="";
    var order = {};
    if(params.nombre_rest!=null){
        var expresion =new RegExp(params.nombre_rest);
        filter["nombre_rest"]=expresion;
    }
    if(params.filters!=null){
        select=params.filters.replace(/,/g, " ");
    }
    if (params.order != null) {
        var data = params.order.split(",");
        var number = parseInt(data[1]);
        order[data[0]] = number;
    }
    //console.log(filter);
    console.log("es estes"+select);
    var restDB=USER.find(filter).
    select(select).
    sort(order);
    restDB.exec((err, docs)=>{
        if(err){
            res.status(500).json({msn: "Error en la coneccion del servidor"});
            return;
        }
        res.status(200).json(docs);
        return;
    });
});
module.exports = router;
