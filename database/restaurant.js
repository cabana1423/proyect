var mongoose = require("./connect");
var REST_SCHEMA = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nickname es necesario"]
    },
    nit: {
        type: Number,
        required: [true, "La edad es necesaria"]
    },
    propietario: {
        type: String,
        required: [true, "La edad es necesaria"]
    },
    calle: {
        type: String,
        required: [true, "La edad es necesaria"]
    },
    telefono: {
        type: Number,
        required: [true, "La edad es necesaria"]
    },
    longitud: {
        type: String, 
        required: [true, "la ruta de la imagen es necesaria"]
    },
    latitud: {
        type: String, 
        required: [true, "la ruta de la imagen es necesaria"]
    },
    logo: {
        type: String, 
    },
    fecha_reg: {
        type: Date,
        default: new Date()
    },
    foto_lugar: {
        type: String, 
        default: "No IMAGE",
        required: [true, "la ruta de la imagen es necesaria"]
    }
});
var REST = mongoose.model("restaurant", REST_SCHEMA);
module.exports = REST;