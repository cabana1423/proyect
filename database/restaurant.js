var mongoose = require("./connect");
var REST_SCHEMA = new mongoose.Schema({
    nombre_rest: {
        type: String,
        required: [true, "El Nombre es necesario"]
    },
    nit: {
        type: Number,
        required: [true, "El NIT es necesaria"]
    },
    propietario: {
        type: String,
        required: [true, "propietario es necesario"]
    },
    calle: {
        type: String,
        required: [true, "La direccion es necesaria"]
    },
    telefono: {
        type: Number,
        required: [true, "El telefono es necesario"]
    },
    /*longitud: {
        type: String, 
        required: [true, "falta log"]
    },
    latitud: {
        type: String, 
        required: [true, "falta lat"]
    },
    logo: {
        type: String, 
    },*/
    fecha_reg: {
        type: Date,
        default: new Date()
    },
    foto_lugar: {
        type:String,
        default: []
    }
});
var REST = mongoose.model("restaurant", REST_SCHEMA);
module.exports = REST;