const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Almoço = new Schema({


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
        default: "Almoço"
    }
})

mongoose.model("almoço", Almoço)