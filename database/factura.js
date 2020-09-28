var mongoose = require("./connect");
var FACTURASCHEMA = new mongoose.Schema({
    idUser_fac: {
        type: String,
        required: [true, "el usuario es necesario"]
    },
    idUserRest_fac: {
        type: String,
        required: [true, "el usuario rest es necesario"]
    },
    cuentas: {
        type: Array,
        default:[]
    },
    total_cancelo: {
        type: Number,
        required: [true, "necesario el total"]
    },
    fecha_reg: {
        type: Date,
        default: new Date()
    },
    toker: {
        type: String,
        required: [true, "necesario el toker"]
    },
    lati: {
        type: String,
        required: [true, "necesario el latitud"]
    },
    longi: {
        type: String,
        required: [true, "necesario longitud"]
    }
});
var FACTURA = mongoose.model("facturas", FACTURASCHEMA);
module.exports = FACTURA;