var express = require("express");
var router = express.Router();
var fileUpload = require("express-fileupload")
var sha1 = require("sha1");
var REST = require("../database/restaurant");
var IMGMENU = require("../database/img_menu");
//imagen de restaurante
router.post("/imgmenu", async(req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El id es necesario"});
             return;
    }
    var id = params.id;
    var docs = await REST.find({_id: id});
    if (docs.length > 0) {
        var idrest = docs[0].id;
    }else{
        res.status(300).json({msn: "El usuario no existe"});
        return;
    }
    console.log(idrest);
    var img = req.files.file;
    var path = __dirname.replace(/\/routes/g, "/img_menu");
    var date = new Date();
    var sing  = sha1(date.toString()).substr(1, 5);
    var totalpath = path + "/" + sing + "_" + img.name.replace(/\s/g,"_");
    img.mv(totalpath, async(err) => {
        if (err) {
            return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
        }
        var obj = {};
        if (img.name != null) {
            obj["nombre"] = img.name;
        }
        obj["pathfile"] = totalpath;
        obj["id_rest_img"] = idrest;
        var image = new IMGMENU(obj);
        image.save((err, docs) => {
            if (err) {
                res.status(500).json({msn: "ERROR  AL GUARDAR INFORMACION "})
                return;
            }
            res.status(200).json({name: img.name});
        });
    });
});
router.get("/imgmenu", async(req, res, next)=>{
    var params=req.query;
    if(params==null){
        res.status(300).json({msn: "error es necesario una ID"});
        return;
    }
    var idimg = params.id ;
    var imagen=await IMGMENU.find({_id: idimg});
    if(imagen.length>0){
        var path=imagen[0].pathfile;
        res.sendFile(path);
        return;
    }
    res.status(300).json({msn: "error en la peticion"});
    return;
});

router.put("/imgmenu", async(req, res) => {
    var params = req.query;
    var obj = {};
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID imagen es necesario"});
        return;
    }
    var img = req.files.file;
    var path = __dirname.replace(/\/routes/g, "/img");
    var date = new Date();
    var sing  = sha1(date.toString()).substr(1, 5);
    var totalpath = path + "/" + sing + "_" + img.name.replace(/\s/g,"_");
    img.mv(totalpath, (err) => {
        if (err) {
            return res.status(300).send({msn : "Error al escribir el archivo en el disco duro"});
        }
    });
    IMGMENU.update({_id:  params.id}, {$set: {"nombre":img.name,"pathfile":totalpath}}, (err, docs) => {
       if (err) {
           res.status(500).json({msn: "Existen problemas en la base de datos"});
            return;
        } 
        res.status(200).json(docs);
    });

});
router.delete("/imgmenu", (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    IMGMENU.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
module.exports = router;