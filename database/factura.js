var mongoose = require("./connect");
var FACTURASCHEMA = new mongoose.Schema({
    idUser_fac: {
        type: String,
        required: [true, "el usuario es necesario"]
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
    }
});
var FACTURA = mongoose.model("facturas", FACTURASCHEMA);
module.exports = FACTURA;