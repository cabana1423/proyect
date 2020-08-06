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
        res.status(300).json({msn: "El restaurant no existe"});
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
        //REVISAR METADATOS
        //console.log(totalpath);
        //console.log(img);
        var obj = {};
        if (img.name != null) {
            obj["nombre"] = img.name;
        }
        obj["pathfile"] = totalpath;
        obj["id_rest_up"] = idrest;
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
module.exports = router;