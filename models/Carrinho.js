const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const Carrinho = new Schema({

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


mongoose.model("carrinho", Carrinho)