const { ObjectID, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;
const $ = require('jquery')
const Contas = new Schema({


    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: "uploads//users//defaultimage.jpeg"
    },
    description:{
        type: String,
        default: "Olá, sou novo neste App"
    },
    aniversario:{
        type: Date
    },
    Admin:{
        type: Number,
        default: 0
    },
    

})



mongoose.model("contas", Contas)