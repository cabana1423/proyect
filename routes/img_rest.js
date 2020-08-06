var express = require("express");
var router = express.Router();
var fileUpload = require("express-fileupload")
var sha1 = require("sha1");
var USER = require("../database/user");
var IMG = require("../database/img");
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
    //console.log(idusario);
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
        }
        obj["pathfile"] = totalpath;
        obj["id_user_up"] = idusario;
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