var express = require("express");
var router = express.Router();
var fileUpload = require("express-fileupload")
var sha1 = require("sha1");
var REST = require("../database/restaurant");
var USER = require("../database/user");
var IMG = require("../database/img");

//tamaño imagen
router.use(fileUpload({
    fileSize: 10 * 1024 * 1024
}));
//GET mostrar
router.get("/rest", (req, res) => {
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
    REST.find(filter).
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
router.post("/rest", async(req, res) => {
    var userRest = req.body;
    var userDB = new REST(userRest);
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
router.put("/rest", async(req, res) => {
    var params = req.query;
    var bodydata = req.body;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    else{

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
router.delete("/rest", (req, res) => {
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
//imagen de restaurante
router.post("/sendimg", async(req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El id es necesario"});
             return;
    }
    var id = params.id;
    var docs = await USER.find({_id: id});
    if (docs.length > 0) {
        var idusario = docs[0].id;
    }else{
        res.status(300).json({msn: "El usuario no existe"});
        return;
    }
    console.log(idusario);
    var img = req.files.file;
    var path = __dirname.replace(/\/routes/g, "/img");
    var date = new Date();
    var sing  = sha1(date.toString()).substr(1, 5);
    var totalpath = path + "/" + sing + "_" + img.name.replace(/\s/g,"_");
    img.mv(totalpath, async(err) => {
        if (err) {
            return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
        }
        //REVISAR METADATOS
        //console.log(totalpath);
        //console.log(img);
        var obj = {};
        if (img.name != null) {
            obj["nombre"] = img.name;
            obj["pathfile"] = totalpath;
            obj["id_user_up"] = idusario;
        }
        var image = new IMG(obj);
        image.save((err, docs) => {
            if (err) {
                res.status(500).json({msn: "ERROR  AL GUARDAR INFORMACION "})
                return;
            }
            res.status(200).json({name: img.name});
        });
    });
});
module.exports = router;