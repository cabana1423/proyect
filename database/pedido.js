var mongoose = require("./connect");
var PEDIDOCHEMA = new mongoose.Schema({
    idUser_ped: {
        type: String,
        required: [true, "el usuario es necesario"]
    },
    idRest_ped: {
        type: String,
        required: [true, "el restaurante es necesario"]
    },
    idMenu_ped: {
        type: String,
        required: [true, "El menu es necesario"],
    },
    toker_order: {
        type: String,
        required: [true, "El toker es necesario"],
    },
    nombre_menu: {
        type: String,
        required: [true, "El toker es necesario"],
    },
    cantidad: {
        type: String,
        required: [true, " la cantidad es necesario"]
    },
    fecha_reg: {
        type: Date,
        default: new Date()
    },
    /*lat: {
        type: String,
        required: [true, "lat necesaria"]
    },
    log: {
        type: String,
        required: [true, " log necesaria"]
    },*/
    pago_total: {
        type: Number,
        required: [true, " pago total necesario"]
    }
});
var PEDIDO = mongoose.model("pedidos", PEDIDOCHEMA);
module.exports = PEDIDO;