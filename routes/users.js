const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
require("../models/Sobremesas")
const Sobremesas = mongoose.model("sobremesas")
require("../models/Bebidas")
const Bebidas = mongoose.model("bebidas")
require("../models/FastFood")
const FastFood = mongoose.model("fastfood")
require("../models/Almoço")
const Almoço = mongoose.model("almoço")
require("../models/Tira-Gosto")
const TiraGosto = mongoose.model("tiragosto")
require("../models/Contas")
const Contas = mongoose.model("contas")
require("../models/Carrinho")
const Carrinho = mongoose.model("carrinho")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const {isLogado} = require("../helpers/isLogado")
const path = require("path")
const fs = require("fs")


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/users/")
        
    },
    filename: function(req, file, cb){
        let data =  Date.now().toString().replace(/:/g, '-') + '-';
        cb(null, data + req.user.name+file.originalname);
       

    }
})
const uploadUsers = multer({ storage })

const fileFilter  = (req, file, callback) => {

        if(file.mimetype == "image/jpg" || file.mimetype == "image/png"){
            callback(null, true)
        }
        else{
            callback(null, false)
        }

}

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})
router.post("/registro", (req, res) => {
    let erros = []

    if(!req.body.username || typeof req.body.username == undefined || req.body.username == null){
        erros.push({texto: "Nome é Inválido"})
    } 
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email é Inválido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha Inválida"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "as Senhas devem ser iguais!!"})
    }
    if(req.body.username.length < 4){
        erros.push({texto: "Nome deve ter no minino 4 caracteres"})
    }
    if(req.body.senha.length < 6 || req.body.senha.length > 15){
        erros.push({texto: "Nome deve ter no minino 6 e no máximo 15 caracteres"})
    }
    if(erros.length > 0)
    {
        res.render("usuarios/registro", ({erros: erros}))
    }
    else{

            Contas.findOne({email: req.body.email}).lean().then((usuario) => {

                if(usuario)
                {
                    req.flash("error_msg", "Já existe um usuario cadastrado com esse seguinte e-mail")
                    res.redirect("/clientes/registro")
                    console.log("Erro usuario já cadastrado")
                }
                else{
                   
                    const novoUsuario = {
                        name: req.body.username,
                        email: req.body.email,
                        password: req.body.senha,
                        Admin: false,
                
                    }
                  
    
                    bcrypt.genSalt(10, (erro, salt) => {
                            bcrypt.hash(novoUsuario.password, salt, (erro, hash) => {
                                if(erro)
                                {
                                    req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                                    res.redirect("/clientes/registro")
                                }
                                novoUsuario.password = hash;

                                new Contas(novoUsuario).save().then(() => {
                                    console.log("usuario cadastrado com sucesso")
                                   req.flash("success_msg", "Usuário Cadastrado com Sucesso")
                                   res.redirect("/clientes/registro")
                                  
                               }).catch((error) => {
                                       req.flash("error_msg", "Houve um erro ao criar o usúario, tente novamente" + error)
                                       res.redirect("/clientes/registro")
                                       console.log("erro ao cadastrar o usuario" + error)
                               })
                            })

                    })
                    
                }
            });

    }
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/clientes/login", 
        failureFlash: true
    })(req, res, next)
    
})

router.get("/logout",(req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success_msg", "Deslogado Com Sucesso")
        res.redirect("/");
      });
})


router.get("/sobremesa/item/:id",isLogado, (req, res) => {
    
    Sobremesas.findOne({_id: req.params.id}).lean().then((sobremesa) => {

            res.render("usuarios/addcarrinho", {name: sobremesa.name, price: sobremesa.price, img: sobremesa.img, description: sobremesa.description, categoria: sobremesa.categoria})
    })
})
router.get("/bebidas/item/:id",isLogado, (req, res) => {
    
    Bebidas.findOne({_id: req.params.id}).lean().then((bebidas) => {

            res.render("usuarios/addcarrinho", {name: bebidas.name, price: bebidas.price, img: bebidas.img, description: bebidas.description, categoria: bebidas.categoria})
    })
})
router.get("/almoco/item/:id", isLogado,(req, res) => {
    
    Almoço.findOne({_id: req.params.id}).lean().then((almoco) => {

            res.render("usuarios/addcarrinho", {name: almoco.name, price: almoco.price, img: almoco.img, description: almoco.description, categoria: almoco.categoria})
    })
})
router.get("/fastfood/item/:id",isLogado, (req, res) => {
    
    FastFood.findOne({_id: req.params.id}).lean().then((fastfood) => {

            res.render("usuarios/addcarrinho", {name: fastfood.name, price: fastfood.price, img: fastfood.img, description: fastfood.description, categoria: fastfood.categoria})
    })
})
router.get("/tiragosto/item/:id", isLogado,(req, res) => {
    
    TiraGosto.findOne({_id: req.params.id}).lean().then((tiragosto) => {

            res.render("usuarios/addcarrinho", {name: tiragosto.name, price: tiragosto.price, img: tiragosto.img, description: tiragosto.description, categoria: tiragosto.categoria})
    })
})


router.post("/addcart", isLogado,(req,res) => {
    let valorTotal = req.body.price * req.body.quantidade; //calcula o valor do produto * a quantidade que ele escolheu
  
        res.render("usuarios/produtosCheckout", {nome: req.body.name, preco: valorTotal, img: req.body.img, quantidade: req.body.quantidade, observacao: req.body.campo, categoria: req.body.categoria})

})
router.post("/comprado", (req, res) => {

    
    const novoProduto = {
        UserID: req.user._id,
        produto: req.body.nome,
        precoTotal: req.body.preco,
        preco: req.body.preco / req.body.quantidade,
        quantidade: req.body.quantidade,
        observacao: req.body.observacao,
        img: req.body.img
    } 
    new Carrinho(novoProduto).save().then(() => {

        req.flash("success_msg", "Item Adicionado no Carrinho")

        if(req.body.categoria == "Sobremesas") // se a categoria do produto for  sobremesa ele retorna para a página de Sobremesas
        {
            res.redirect("/admin/sobremesas")
            req.flash("success_msg", "Item Adicionado no Carrinho")
        }
        else if(req.body.categoria == "Bebidas"){
            res.redirect("/admin/Bebidas")
            req.flash("success_msg", "Item Adicionado no Carrinho")
        }
        else if(req.body.categoria == "FastFood"){
            res.redirect("/admin/fastfoods")
            req.flash("success_msg", "Item Adicionado no Carrinho")
        }
        else if(req.body.categoria == "TiraGosto"){
            res.redirect("/admin/tiragosto")
            req.flash("success_msg", "Item Adicionado no Carrinho")
        }
    }).catch((error) => {
        req.flash("error_msg", "Erro ao Adicionar o item no carrinho !")
        console.log("Erro ao adicionar o item no carrinho:" + error)
    })
})

router.get("/carrinho", isLogado, (req, res) => {

        Carrinho.find({UserID: req.user._id}).lean().then((item) => {
            res.render("usuarios/Carrinho", {item: item})
        }).catch((erro) => {
            console.log("Não foi Possivel listar os itens" + erro)
        })
})
router.get("/carrinho/deletar/:id", isLogado, (req, res) => {

    Carrinho.deleteOne({UserID: req.params.id}).then((produto) => {
        console.log("Produto Deletado do Carrinho com Sucesso")
        res.redirect("/clientes/carrinho")
    })
    .catch((erro) => {
        console.log("não foi possivel deletar o arquivo" + erro)
    })
})

router.get("/carrinho/editar/:id", isLogado, (req, res) => {

    Carrinho.findOne({_id: req.params.id}).lean().then((produto) => {

        res.render("usuarios/editCarrinho", {produto: produto})

    })

})

router.post("/carrinho/editado", isLogado, (req, res) => {

        Carrinho.findOne({_id: req.body.id}).then((produto) => {
        
            produto.quantidade = req.body.quantidade
            produto.observacao = req.body.campo
            
            produto.precoTotal = produto.preco * produto.quantidade

            produto.save().then(() => {
                console.log("produto editado com sucesso")
                res.redirect("/clientes/carrinho")
            }).catch((erro) => {
                console.log("erro ao editar o produto do carrinho: " + erro)
            })
        })
})

router.get("/minhaconta", isLogado, (req, res) => {
    Contas.findOne({_id: req.user._id}).lean().then((usuario) => {
         //formata a data para o metodo brasileiro
        var data = new Date(usuario.aniversario);
        var dataFormatada = data.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
       
            res.render("usuarios/perfil", {usuario: usuario, Data: dataFormatada})
    })
})

router.get("/pedido", isLogado, (req, res) => {

        Carrinho.find({UserID: req.user._id}).lean().then((produto) => {
          
            let valorPedido = produto.precoTotal += produto.precoTotal
            res.render("usuarios/Checkout", {produto: produto, valorPedido: valorPedido})
        })
            
})

router.get("/compra", isLogado, (req, res) => {

        Carrinho.deleteMany({UserID: req.user.id}).then((produto) => {
            console.log("Carrinho Limpo com Sucesso")
        })
        .catch((erro) => {
            console.log("Erro ao Limpar o carrinho: " + erro)
        })
        res.render("usuarios/pedidoFinalizado")
})

router.post("/editar/:id", isLogado, (req, res) => {

   Contas.findOne({_id: req.params.id}).then((usuario) => {

            usuario.name = req.body.name
            usuario.email = req.body.email
            usuario.description = req.body.description
            usuario.aniversario = req.body.data
            console.log(req.body.data)
            usuario.save().then(() => {
                console.log("Usuario Alterado com Sucesso")
                res.redirect("/clientes/minhaconta")
            }).catch((erro) => {
                console.log("Erro ao alterar usuario" + erro)
                res.redirect("/clientes/minhaconta")
            })
   })
    
    
})

router.post("/editarfoto/:id", isLogado, uploadUsers.single('image'), (req, res) => {

    Contas.findOne({_id: req.params.id}).then((usuario) => {

        usuario.img = req.file.path;

        usuario.save().then(() => {
                console.log("Foto Alterada com Sucesso")
                res.redirect("/clientes/minhaconta")
        }).catch((erro) => {
            console.log("Erro ao alterar a foto" + erro)
            res.redirect("/clientes/minhaconta")
        })
    })
})

module.exports = router;