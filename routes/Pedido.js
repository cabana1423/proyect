var express = require("express");
var router = express.Router();
var sha1 = require("sha1");
var PEDIDO = require("../database/pedido");
const USER = require("../database/user");
var MENUREST = require("../database/menuRest");

//GET mostrar
router.get("/order", (req, res) => {
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
    PEDIDO.find(filter).
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
router.post("/order", async(req, res) => {
    //buscamos img de menu
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El id menu es necesario"});
             return;
    }
    if (params.id_u == null) {
        res.status(300).json({msn: "El id user es necesario"});
             return;
    }
    var id_u=params.id_u;
    //de user
    var obj = {};
    obj = req.body;
    var docmenu = await USER.find({_id: id_u});
    if (docmenu.length ==1) {
        obj["idUser_ped"] = id_u;
    }
    else{
        res.status(300).json({msn: "El menu no existe"});
        return;
    }
    var id = params.id;
    //de menu
    var obj = {};
    obj = req.body;
    var docmenu = await MENUREST.find({_id: id});
    if (docmenu.length ==1) {
        obj["idMenu_ped"] = id;
    }
    else{
        res.status(300).json({msn: "El menu no existe"});
        return;
    }
    obj["idRest_ped"]=docmenu[0].id_rest_menu;
    //calcular p_t
    obj["pago_total"]=docmenu[0].precio*obj.cantidad;
    var userDB = new PEDIDO(obj);
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
router.put("/order", async(req, res) => {
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
    PEDIDO.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
        res.status(200).json(docs);
    });

});
//PATCH UPDATE
router.patch("/order", (req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
        msn: "no existe id"
    });
    return;
    }
    var id = req.query.id;
    var params = req.body;
    PEDIDO.findOneAndUpdate({_id: id}, params, (err, docs) => {
        res.status(200).json(docs);
    });
});
//DELETE 
router.delete("/order", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    PEDIDO.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
module.exports = router;