var express = require("express");
var router = express.Router();
//var sha1 = require("sha1");
var FACTURA = require("../database/factura");
var PEDIDO = require("../database/pedido");
var midleware=require("./midleware");

//GET mostrar
router.get("/fac_cliente",midleware, (req, res) => {

    var params= req.query;
    var restDB=FACTURA.find({idUser_fac:params.client});
    restDB.exec((err, docs)=>{
        if(err){
            res.status(500).json({msn: "Error en la coneccion del servidor"});
            return;
        }
        res.status(200).json(docs);
        return;
    });
});
router.get("/facOne",midleware, (req, res) => {

    var params= req.query;
    var restDB=FACTURA.find({_id:params.id});
    restDB.exec((err, docs)=>{
        if(err){
            res.status(500).json({msn: "Error en la coneccion del servidor"});
            return;
        }
        res.status(200).json(docs);
        return;
    });
});
router.get("/fac", midleware, (req, res) => {
    var filter={};
    var params= req.query;
    var select="";
    var order = {};
    if(params.user!=null){
        var expresion =new RegExp(params.user);
        filter["idUserRest_fac"]=expresion;
    }
    if(params.toker!=null){
        var expresion =new RegExp(params.toker);
        filter["toker"]=expresion;
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
    var params = req.query;
    var obj = {};
    obj=req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El id usuario es necesario"});
             return;
    }
    if (params.toker == null) {
        res.status(300).json({msn: "El id toker es necesario"});
             return;
    }
    var docfac = await PEDIDO.find({idUser_ped: params.id,toker_order:params.toker});
    if (docfac.length >0) {
        obj["idUser_fac"] =params.id;
        obj["toker"] =params.toker;
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
//DELETE 
router.delete("/fac", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID factura es necesario"});
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