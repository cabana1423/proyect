var express = require("express");
var router = express.Router();
var sha1 = require("sha1");
var FACTURA = require("../database/factura");
var PEDIDO = require("../database/pedido");

//GET mostrar
router.get("/fac", (req, res) => {
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
    FACTURA.find(filter).
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
router.post("/fac", async(req, res) => {
    //buscamos img de menu
    var params = req.query;
    var obj = {};
    if (params.id == null) {
        res.status(300).json({msn: "El id usuario es necesario"});
             return;
    }
    var id=params.id;
    var docfac = await PEDIDO.find({idUser_ped: id});
    if (docfac.length >0) {
        obj["idUser_fac"] = id;
        obj["cuentas"] = docfac;
    }
    else{
        res.status(300).json({msn: "El usuario no realizo pedidos"});
        return;
    }
    var cancelacion=0;
    for(var i=0;i<docfac.length;i++){
        cancelacion=docfac[i].pago_total+cancelacion;
    }
    obj["total_cancelo"] = cancelacion;
    var userDB = new FACTURA(obj);
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
router.put("/fac", async(req, res) => {
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
    FACTURA.update({_id:  params.id}, {$set: updateobjectdata}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
        res.status(200).json(docs);
    });

});
//PATCH UPDATE
router.patch("/fac", (req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
        msn: "no existe id"
    });
    return;
    }
    var id = req.query.id;
    var params = req.body;
    FACTURA.findOneAndUpdate({_id: id}, params, (err, docs) => {
        res.status(200).json(docs);
    });
});
//DELETE 
router.delete("/fac", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    FACTURA.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
module.exports = router;