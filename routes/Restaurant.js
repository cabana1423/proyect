var express = require("express");
var router = express.Router();
var REST = require("../database/restaurant");
var USER = require("../database/user");
var IMG = require("../database/img");
var midleware=require("./midleware");

//GET mostrar
router.get("/rest",midleware,  (req, res) => {
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
    console.log(filter);
    console.log(select);
    var restDB=REST.find(filter).
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
// POST registrar
router.post("/rest", midleware, async(req, res) => {
    //buscamos img de user
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El id usuario es necesario"});
             return;
    }
    var id = params.id;
    var docs = await USER.find({_id: id});
    if (docs.length ==0) {
        res.status(300).json({msn: "El usuario no existe"});
        return;
    }//id img
    if (params.idi == null) {
        res.status(300).json({msn: "El id imagen es necesario"});
             return;
    }
    var idi = params.idi;
    var docimg = await IMG.find({_id: idi, id_user_img:id});
    if (docimg.length ==0) {
        res.status(300).json({msn: "La imagen no existe no existe"});
        return;
    }
    //introducimos datos a rest
    var obj = {};
    obj = req.body;
    obj["id_user_rest"] = id;
    obj["foto_lugar"] = docimg[0].id;
    var userDB = new REST(obj);
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
router.put("/rest", midleware, async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    var allowkeylist = ["nombre_rest", "nit", "propietario","calle","telefono"];
    var keys = Object.keys(bodydata);
    var updateobjectdata = {};
    for (var i = 0; i < keys.length; i++) {
        if (allowkeylist.indexOf(keys[i]) > -1) {
            updateobjectdata[keys[i]] = bodydata[keys[i]];
        }
    }
    REST.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
        res.status(200).json(docs);
    });

});
//DELETE 
router.delete("/rest",midleware,  (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    REST.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
module.exports = router;