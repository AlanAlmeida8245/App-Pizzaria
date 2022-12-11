const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Bebidas = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    categoria: {
        type: String,
        default: "Bebidas"
    }
})

mongoose.model("bebidas", Bebidas)