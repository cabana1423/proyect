var mongoose = require("./connect");
var IMGSCHEMA = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El Nombre es necesario"]
    },
    pathfile: {
        type: String,
        required: [true, "El la ruta del archivo es necesario"]
    },
    fecha_reg: {
        type: Date,
        default: new Date()
    },
    id_user_up:{
        type:String,
        required:[true, "el usuario es nesesario"]
    }
});
var IMG = mongoose.model("images", IMGSCHEMA);
module.exports = IMG;