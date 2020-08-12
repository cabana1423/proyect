var express = require('express');
var router = express.Router();
var sha1 = require("sha1");
var JWT=require("jsonwebtoken");
var USER = require("../database/user");
var midleware=require("./midleware");

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
  if (!/[\!\"\=\?\¡\¿\$\^\@\&\(\)\{\}\#]+/.test(userRest.password)) {
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
        var token =JWT.sign({
            exp:Math.floor(Date.now()/1000)+(60*60*60),
            data:results[0].id
        }, 'PedroCabanaBautistaPotosiBolivia2020');
        res.status(200).json({msn: "Bienvenido al sistema " + body.email + " :) ",token:token});
        return;
    }
    res.status(200).json({msn: "Credenciales incorrectas"});
});
//GET user
router.get("/user",midleware, (req, res) => {
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
    //console.log("es estes"+select);
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
router.delete("/user",async(req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
        msn: "no existe id"
        });
        return;
    }
        var r = await USER.remove({_id: req.query.id});
        res.status(300).json(r);
    });

router.put("/user", async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    else{

    }
    bodydata.password = sha1(bodydata.password);
    var allowkeylist = ["nombre","password"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    USER.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
        res.status(200).json(docs);
    });

});
module.exports = router;
