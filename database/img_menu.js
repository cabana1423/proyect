var mongoose = require("./connect");
var IMGMENUSCHEMA = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El Nombre es necesario"]
    },
    url: {
        type: String,
        required: [true, "El la ruta del archivo es necesario"]
    },
    fecha_reg: {
        type: Date,
        default: new Date()
    },
    id_rest_img:{
        type:String,
        required:[true, "el usuario es nesesario"]
    }
});
var IMGMENU = mongoose.model("images_menu", IMGMENUSCHEMA);
module.exports = IMGMENU;