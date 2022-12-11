const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const Pedidos = new Schema({

    UserID: {
        type: String,
    
    },
    produto: {
        type: String,

    },
    preco:{
        type: Number
        
    },
    precoTotal:{
        type: Number
    },
    observacao:{
        type: String
    },
    quantidade: {
        type: Number
    },
    img:{
        type: String
    }
})


mongoose.model("pedidos", Pedidos)