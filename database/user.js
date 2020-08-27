var mongoose = require("./connect");
var USERSCHEMA = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El Nombre es necesario"]
    },
    email: {
        type: String,
        required: [true, "El email es necesario"],
        validate: {
            validator: (value) => {
                return /^[\w\.]+@[\w\.]+\.\w{3,3}$/.test(value);
            },
            message: props => `${props.value} no es valido` 
        }
        
    },
    password: {
        type: String,
        required: [true, "El password es necesario"]
    },
    fecha_reg: {
        type: Date,
        default: new Date()
    },
    roles: {
        type: Array,
        default:[]
    },
    /*tipo: {
        type: String,
        required: [true, "El tipo de usuario es necesario"]
    }*/
});
var USER = mongoose.model("user", USERSCHEMA);
module.exports = USER;