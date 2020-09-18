var express = require("express");
var router = express.Router();
var USER = require("../database/user");
var IMG = require("../database/img");
//multer
const {Storage}=require('@google-cloud/storage');
const Multer=require('multer');
const path=require('path');
var midleware=require("./midleware");


const gc=new Storage({
    keyFilename:path.join(__dirname,'../storage_cabana-proyect.json'),
    projectId:'zippy-zenith-287722'
});
var maxSize = 5 * 1000 * 1000;
var multer=Multer({
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

const bucket=gc.bucket(process.env.GCLOUD_STORAGE_BUCKET||'bucket_proyect-rest');

router.post("/restimg" ,midleware, multer.single('img'), async(req, res) => {
    var params = req.query;
    //id user
   if (params.id == null) {
        res.status(300).json({msn: "El id es necesario"});
             return;
    }
    var id = params.id;
    var docs = await USER.find({_id: id});
    if (docs.length == 1) {
        var iduser = docs[0].id;
    }else{
        res.status(300).json({msn: "El usuario no existe"});
        return;
    }
    if(!req.file){
        res.status(400).json({message:'no se envio ningun archivos'});
    }
    console.log(req.file);
    var obj={};
    const blob=bucket.file(req.file.originalname);
    const blobStream=blob.createWriteStream({
      resumable:false
    });

    blobStream.on('error',(err)=>{
      res.json({message:err});
    });

    blobStream.on('finish',async()=>{
      let url='https://storage.googleapis.com/'+bucket.name+'/'+blob.name;
      obj["id_user_img"] = iduser;
      obj["url"] = url;
      obj["name"] = blob.name;
      const ins=new IMG(obj);
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
router.get("/restimg",midleware, async(req, res, next)=>{
    var params=req.query;
    if(params==null){
        res.status(300).json({msn: "error es necesario una ID"});
        return;
    }
    var idimg = params.id ;
    var imagen=await IMG.find({_id: idimg});
    if(imagen.length==1){
        res.json(imagen[0]);
        return;
    }
    res.status(300).json({msn: "error en la peticion"});
    return;
});
router.delete("/restimg",midleware, (req, res) => {
    var params = req.query;
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID es necesario"});
        return;
    }
    IMG.remove({_id: params.id}, (err, docs) => {
        if (err) {
            res.status(500).json({msn: "Existen problemas en la base de datos"});
             return;
         } 
         res.status(200).json(docs);
    });
});
router.put("/restimg",midleware,multer.single('img'), async(req, res) => {
    var params = req.query;
    var obj = {};
    if (params.id == null) {
        res.status(300).json({msn: "El parámetro ID imagen es necesario"});
        return;
    }
    //upload
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
        IMG.update({_id:  params.id}, {$set: {"name":blob.name,"url":url}}, (err, docs) => {
            if (err) {
                res.status(500).json({msn: "Existen problemas al ingresar los datos"});
                 return;
             } 
             res.status(200).json(docs);
         });
    });
    blobStream.end(req.file.buffer);
});

module.exports = router;