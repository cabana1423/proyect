var express = require("express");
var router = express.Router();
var REST = require("../database/restaurant");
var IMGMENU = require("../database/img_menu");
const {Storage}=require('@google-cloud/storage');
const Multer=require('multer');
const path=require('path');
var midleware=require("./midleware");

const gc=new Storage({
    keyFilename:path.join(__dirname,'../storage_cabana-proyect.json'),
    projectId:'zippy-zenith-287722'
});
var maxSize = 5 * 1000 * 1000;
const multer=Multer({
    storage:Multer.memoryStorage(),
    limits: { fileSize: maxSize },
    /*fileFilter: function(req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg'&&file.mimetype !== 'image/jpg') 
        {
            return cb(null, false);
        } else {
            cb(null, true);
        }
    }*/
});
const bucket=gc.bucket(process.env.GCLOUD_STORAGE_BUCKET||'bucket_proyect_menu');

router.post("/imgmenu", midleware,multer.single('img'), async(req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El id es necesario"});
             return;
    }
    var id = params.id;
    var docs = await REST.find({_id: id});
    if (docs.length ==1) {
        var idrest = docs[0].id;
    }else{
        res.status(300).json({msn: "El restaurante no existe"});
        return;
    }
    //upload
    if(!req.file){
        res.status(400).json({message:'no se envio ningun archivos'});
    }
    var obj={};
    const blob=bucket.file(req.file.originalname);
    const blobStream=blob.createWriteStream({
      resumable:false
    });

    blobStream.on('error',(err)=>{
      res.json({msn:err});
    });

    blobStream.on('finish',async()=>{
      let url='https://storage.googleapis.com/'+bucket.name+'/'+blob.name;
      obj["id_rest_img"] = idrest;
      obj["url"] = url;
      obj["name"] = blob.name;
      const ins=new IMGMENU(obj);
      await ins.save((err,docs)=>{
        if (err) {
            res.status(300).json(err);
            return;
        }
        res.json(docs);
        return;
      });
    
    });

    blobStream.end(req.file.buffer);
});
router.get("/imgmenu", midleware, async(req, res, next)=>{
    var params=req.query;
    if(params.id==null){
        res.status(300).json({msn: "error es necesario una ID"});
        return;
    }
    var idimg = params.id ;
    var imagen=await IMGMENU.find({_id: idimg});
    if(imagen.length==1){
        res.json(imagen[0]);
        return;
    }
    res.status(300).json({msn: "error en la peticion"});
    return;
});

router.put("/imgmenu",midleware,multer.single('img'), async(req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID imagen es necesario"});
        return;
    }
    if(!req.file){
        res.status(400).json({message:'no se envio ningun archivos'});
    }
    const blob=bucket.file(req.file.originalname);
    const blobStream=blob.createWriteStream({
      resumable:false
    });

    blobStream.on('error',(err)=>{
      res.json({message:err});
    });
    blobStream.on('finish',async()=>{
        let url='https://storage.googleapis.com/'+bucket.name+'/'+blob.name;
        IMGMENU.update({_id:  params.id}, {$set: {"name":blob.name,"url":url}}, (err, docs) => {
            if (err) {
                res.status(500).json({msn: "Existen problemas al actualizar los base de datos"});
                 return;
             } 
             res.status(200).json(docs,{id_imgm:params.id});
         });
    });
    blobStream.end(req.file.buffer);

});
router.delete("/imgmenu",midleware,  (req, res) => {
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