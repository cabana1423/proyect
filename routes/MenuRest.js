var express = require("express");
var router = express.Router();
var fileUpload = require("express-fileupload")
var sha1 = require("sha1");
var MENUREST = require("../database/menuRest");
var REST = require("../database/restaurant");
var IMGMENU = require("../database/img_menu");
const USER = require("../database/user");
var midleware=require("./midleware");
//GET mostrar
router.get("/menu",midleware, (req, res) => {
    var filter={};
    var params= req.query;
    var select="";
    var order = {};
    if(params.nombre_menu!=null){
        var expresion =new RegExp(params.nombre_menu);
        filter["nombre_menu"]=expresion;
    }
    if(params.filters!=null){
        select=params.filters.replace(/,/g, " ");
    }
    if (params.order != null) {
        var data = params.order.split(",");
        var number = parseInt(data[1]);
        order[data[0]] = number;
    }
    MENUREST.find(filter).
    select(select).
    sort(order).
    exec((err, docs)=>{
        if(err){
            res.status(500).json({msn: "Error en la coneccion del servidor"});
            return;
        }
        res.status(200).json(docs);
        return;
    });
});
// POST registrar
router.post("/menu",midleware, async(req, res) => {
    //buscamos img de user
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El id restaurant es necesario"});
             return;
    }
    var id = params.id;
    if (params.idim == null) {
        res.status(300).json({msn: "El id imagen menu es necesario"});
             return;
    }
    var idim = params.idim;
    //introducimos datos a menu
    var obj = {};
    obj = req.body;
    var docsrest = await REST.find({_id: id});
    if (docsrest.length ==1) {
        obj["id_rest_menu"] = id;
    }
    else{
        res.status(300).json({msn: "El restaurante no existe"});
        return;
    }
    var docs = await IMGMENU.find({_id:idim, id_rest_img: id});
    console.log(docs);
    if (docs.length ==1) {
        obj["foto_produc"] = docs[0].id;
    }else{
        res.status(300).json({msn: "La imagen no existe"});
        return;
    } 
    obj["id_usuario_menu"]=docsrest[0].id_user_rest;
    var userDB = new MENUREST(obj);
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
//PUT actualizar
router.put("/menu", midleware, async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    var allowkeylist = ["nombre_menu", "precio", "descripcion"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    MENUREST.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
        res.status(200).json(docs);
    });

});
//DELETE 
router.delete("/menu",midleware, (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    MENUREST.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
module.exports = router;