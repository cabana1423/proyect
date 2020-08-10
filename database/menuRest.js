var mongoose = require("./connect");
var MENURESTSCHEMA = new mongoose.Schema({
    nombre_menu: {
        type: String,
        required: [true, "El Nombre es necesario"]
    },
    precio: {
        type: String,
        required: [true, "El precio es necesaria"]
    },
    descripcion: {
        type: String,
        required: [true, "La descripcion del menu es nesesaria es necesario"]
    },
    fecha_reg: {
        type: Date,
        default: new Date()
    },
    foto_produc: {
        type: Array, 
        default: [],
    },
    id_usuario_menu: {
        type: String,
        required: [true, "el usuario es necesario"]
    },
    id_rest_menu: {
        type: String,
        required: [true, "El restauante es necesaria"]
    }
});
var MENUREST = mongoose.model("menu", MENURESTSCHEMA);
module.exports = MENUREST;