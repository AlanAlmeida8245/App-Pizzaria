
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
require("../models/FastFood")
require("../models/Bebidas")
require("../models/Sobremesas")
require("../models/Tira-Gosto")
require("../models/Almoço")
require("../models/Contas")
const FastFood = mongoose.model("fastfood")
const Bebidas = mongoose.model("bebidas")
const Sobremesas = mongoose.model("sobremesas")
const Almoço = mongoose.model("almoço")
const TiraGosto = mongoose.model("tiragosto")
const Contas = mongoose.model("contas")
const path = require("path")
const fs = require("fs")
const {isAdmin} = require("../helpers/isAdmin")
const uploadImage = require("../services/firebase")


const Multer = multer({
    storage: multer.memoryStorage(),
    limits: 1024 * 1024
})

const fileFilter  = (req, file, callback) => {

        if(file.mimetype == "image/jpg" || file.mimetype == "image/png"){
            callback(null, true)
        }
        else{
            callback(null, false)
        }

}


    router.use("/novoproduto", isAdmin, (req, res) => {
        res.render("admin/addsnack")
    })

    router.post("/novolanche", isAdmin, (req, res) => {

            let erros = []
            console.log(req.body)
            console.log(req.file)
           
        
       
            if(!req.body.name || typeof req.body.name == undefined || req.body.name == null)
            {
                erros.push({texto: "Nome Inválido"})
            }
            if(!req.body.description || typeof req.body.description == undefined || req.body.description == null)
            {
                erros.push({texto: "Descrição Inválida"})
            }
            if(!req.body.price || req.body.price == 0 || typeof req.body.price == undefined || req.body.price == null)
            {
                erros.push({texto: "Preço Inválido"})
            }
            if(req.body.section == "Categoria"){
                erros.push({texto: "Escolha uma Categoria"})
            }
            if(erros.length > 0)
            {
                res.render("admin/addsnack", {erros: erros})
            }
            else{
                const novoLanche = {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    section: req.body.section,
                    img: req.file.path
                }
                if(req.body.section == "FastFood"){
                    new FastFood(novoLanche).save().then(() => {
                        req.flash("success_msg", "Lanche Cadastrado com Sucesso")
                        res.redirect("/admin/novoproduto")
                    }).catch((err) => {
                        req.flash("error_msg", "Ocorreu um erro ao salvar o lanche" + err)
                        res.redirect("/admin/novoproduto")
                    })
                }
                if(req.body.section == "Almoço")
                {
                    new Almoço(novoLanche).save().then(() => {
                        req.flash("success_msg", "Lanche Cadastrado com Sucesso")
                        res.redirect("/admin/novoproduto")
                    }).catch((err) => {
                        req.flash("error_msg", "Ocorreu um erro ao salvar o lanche" + err)
                        res.redirect("/admin/novoproduto")
                    })
                }
                if(req.body.section == "Bebidas")
                {
                    new Bebidas(novoLanche).save().then(() => {
                        req.flash("success_msg", "Lanche Cadastrado com Sucesso")
                        res.redirect("/admin/novoproduto")
                    }).catch((err) => {
                        req.flash("error_msg", "Ocorreu um erro ao salvar o lanche" + err)
                        res.redirect("/admin/novoproduto")
                    })
                }
                if(req.body.section == "Sobremesas")
                {
                    new Sobremesas(novoLanche).save().then(() => {
                        req.flash("success_msg", "Lanche Cadastrado com Sucesso")
                        res.redirect("/admin/novoproduto")
                    }).catch((err) => {
                        req.flash("error_msg", "Ocorreu um erro ao salvar o lanche" + err)
                        res.redirect("/admin/novoproduto")
                    })
                }
                if(req.body.section == "Tira-Gosto")
                {
                    new TiraGosto(novoLanche).save().then(() => {
                        req.flash("success_msg", "Lanche Cadastrado com Sucesso")
                        res.redirect("/admin/novoproduto")
                    }).catch((err) => {
                        req.flash("error_msg", "Ocorreu um erro ao salvar o lanche" + err)
                        res.redirect("/admin/novoproduto")
                    })
                }
                if(req.body.section == "Categoria"){
                    res.redirect("/admin/novoproduto")
                    req.flash("error_msg", "Selecione uma categoria")
                }
                
            }

               
    })

    router.get("/fastfoods", (req, res) => {
        FastFood.find().lean().then((lanches) => {
            res.render("categorias/fastfood", {lanches: lanches})
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao listar os lanches: " + error)
            res.redirect("/")
        })
    })

    router.get("/bebidas", (req, res) => {
        Bebidas.find().lean().then((bebidas) => {
            res.render("categorias/bebidas", {bebidas: bebidas})
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao listar os lanches: " + error)
            res.redirect("/")
        })
    })

    router.get("/sobremesas", (req, res) => {
        Sobremesas.find().lean().then((sobremesas) => {
            res.render("categorias/sobremesas", {sobremesas: sobremesas})
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao listar os lanches: " + error)
            res.redirect("/")
        })
    })
    router.get("/almoco", (req, res) => {
        Almoço.find().lean().then((almoco) => {
            res.render("categorias/almoço", {almoco: almoco})
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao listar os lanches: " + error)
            res.redirect("/")
        })
    })
    router.get("/tiragosto", (req, res) => {
        TiraGosto.find().lean().then((tiragosto) => {
            res.render("categorias/tiragosto", {tiragosto: tiragosto})
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao listar os lanches: " + error)
            res.redirect("/")
        })
    })
    

    router.use("/dashboard", isAdmin, (req, res) => {
         res.render("admin/dashboard")
    })
    router.get("/deletar", isAdmin, (req, res) => {
        Sobremesas.find().lean().then((sobremesa) => {
                Almoço.find().lean().then((almoco) => {
                       Bebidas.find().lean().then((bebidas) => {
                        TiraGosto.find().lean().then((tiragosto) => {
                            FastFood.find().lean().then((lanches) => {
                                res.render("admin/delete", {sobremesa: sobremesa, almoco: almoco, bebidas: bebidas, tiragosto: tiragosto, fastfood: lanches})
                            })
                        })
                       }) 
                })
        })
       
    })

    router.get("/deletar/tiragosto/:id", isAdmin, (req, res) => {
        TiraGosto.deleteOne({_id: req.params.id}).then(() => {
            req.flash("success_msg", "Produto Deletado com Sucesso")
            console.log("Produto deletado com sucesso")
            res.redirect("/admin/deletar")
        }).catch((erro) => {
            req.flash("success_msg", "Houve um erro ao deletar o item ")
            console.log("Produto nao foi deletado" + erro)
            res.redirect("/admin/deletar")
        })
    })
   
    router.get("/deletar/almoco/:id", isAdmin, (req, res) => {
        Almoço.deleteOne({_id: req.params.id}).then(() => {
            req.flash("success_msg", "Produto Deletado com Sucesso")
            console.log("Produto deletado com sucesso")
            res.redirect("/admin/deletar")
        
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao deletar o item ")
            console.log("Produto nao foi deletado" + erro)
            res.redirect("/admin/deletar")
        })
    })
   
    router.get("/deletar/sobremesa/:id", isAdmin, (req, res) => {
        Sobremesas.deleteOne({_id: req.params.id}).then(() => {
            req.flash("success_msg", "Produto Deletado com Sucesso")
            console.log("Produto deletado com sucesso")
            res.redirect("/admin/deletar")
            
        }).catch((erro) => {
            req.flash("success_msg", "Houve um erro ao deletar o item ")
            console.log("Produto nao foi deletado" + erro)
            res.redirect("/admin/deletar")
           
        })
    })
   
    router.get("/deletar/fastfood/:id", isAdmin, (req, res) => {
        FastFood.deleteOne({_id: req.params.id}).then(() => {
            req.flash("success_msg", "Produto Deletado com Sucesso")
            console.log("Produto deletado com sucesso")
            res.redirect("/admin/deletar")
     
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao deletar o item ")
            console.log("Produto nao foi deletado" + erro)
            res.redirect("/admin/deletar")
           
        })
    })

    router.get("/deletar/bebidas/:id", isAdmin, (req, res) => {
        Bebidas.deleteOne({_id: req.params.id}).then(() => {
            req.flash("success_msg", "Produto Deletado com Sucesso")
            console.log("Produto deletado com sucesso")
            res.redirect("/admin/deletar")
     
        }).catch((erro) => {
            req.flash("success_msg", "Houve um erro ao deletar o item ")
            console.log("Produto nao foi deletado" + erro)
            res.redirect("/admin/deletar")
        })
    })
   

    router.get("/editar/sobremesa/:id",isAdmin,(req, res) => {
        Sobremesas.findOne({_id: req.params.id}).then((sobremesa) => {
            let name = sobremesa.name;
            let description = sobremesa.description;
            let price = sobremesa.price;
            let img = sobremesa.img;
            let _id = sobremesa._id;

            res.render("admin/editSobremesa", {name: name, description: description, price: price, img: img, _id: _id})
        })
    })

    router.get("/editar/fastfood/:id", isAdmin,(req, res) => {
        FastFood.findOne({_id: req.params.id}).then((fastfood) => {
            let name = fastfood.name;
            let description = fastfood.description;
            let price = fastfood.price;
            let img = fastfood.img;
            let _id = fastfood._id;

            res.render("admin/editFastFood", {name: name, description: description, price: price, img: img, _id: _id})
        })
    })

    router.get("/editar/bebidas/:id", isAdmin ,(req, res) => {
        Bebidas.findOne({_id: req.params.id}).then((bebidas) => {
            let name = bebidas.name;
            let description = bebidas.description;
            let price = bebidas.price;
            let img = bebidas.img;
            let _id = bebidas._id;

            res.render("admin/editBebidas", {name: name, description: description, price: price, img: img, _id: _id})
        })
    })

    router.get("/editar/almoco/:id", isAdmin ,(req, res) => {
        Almoço.findOne({_id: req.params.id}).then((almoco) => {
            let name = almoco.name;
            let description = almoco.description;
            let price = almoco.price;
            let img = almoco.img;
            let _id = almoco._id;

            res.render("admin/editAlmoço", {name: name, description: description, price: price, img: img, _id: _id})
        })
    })

    router.get("/editar/tiragosto/:id", isAdmin ,(req, res) => {
        TiraGosto.findOne({_id: req.params.id}).then((tiragosto) => {
            let name = tiragosto.name;
            let description = tiragosto.description;
            let price = tiragosto.price;
            let img = tiragosto.img;
            let _id = tiragosto._id;

            res.render("admin/editTiraGosto", {name: name, description: description, price: price, img: img, _id: _id})
        })
    })

    

    router.post("/edit/sobremesa", isAdmin, (req, res) => {

        let erros = []
    
        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null)
        {
            erros.push({texto: "Nome Inválido"})
        }
        if(!req.body.description || typeof req.body.description == undefined || req.body.description == null)
        {
            erros.push({texto: "Descrição Inválida"})
        }
        if(!req.body.price || req.body.price == 0 || typeof req.body.price == undefined || req.body.price == null)
        {
            erros.push({texto: "Preço Inválido"})
        }
        if(erros.length > 0)
        {
            res.render("admin/editSobremesa", {erros: erros})
        }
        else{
            Sobremesas.findOne({_id: req.body.id}).then((sobremesa) => {
                sobremesa.name = req.body.name
                sobremesa.price = req.body.price
                sobremesa.description = req.body.description
                sobremesa.img = req.file.path

                sobremesa.save().then(() => {
                    req.flash("success_msg", "Sobremesa Editada com sucesso")
                    res.redirect('/admin/deletar')
                    console.log("sobremesa editada com sucesso")
                }).catch((erro) => {
                    req.flash("error_msg", "Houve um erro interno ao salvar a alteração da sobremesa")
                    console.log("erro ao editar a sobremesa: " + erro)
                    res.redirect('/admin/deletar')
                })
            })
        }

    })

    router.post("/edit/fastfood", isAdmin,  (req, res) => {

        let erros = []
    
        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null)
        {
            erros.push({texto: "Nome Inválido"})
        }
        if(!req.body.description || typeof req.body.description == undefined || req.body.description == null)
        {
            erros.push({texto: "Descrição Inválida"})
        }
        if(!req.body.price || req.body.price == 0 || typeof req.body.price == undefined || req.body.price == null)
        {
            erros.push({texto: "Preço Inválido"})
        }
        if(erros.length > 0)
        {
            res.render("admin/editFastFood", {erros: erros})
        }
        else{
            FastFood.findOne({_id: req.body.id}).then((fastfood) => {
                fastfood.name = req.body.name
                fastfood.price = req.body.price
                fastfood.description = req.body.description
                fastfood.img = req.file.path

                fastfood.save().then(() => {
                    req.flash("success_msg", "lanche Editado com sucesso")
                    res.redirect('/admin/deletar')
                    console.log("Lanche editado com sucesso")
                }).catch((erro) => {
                    req.flash("error_msg", "Houve um erro interno ao salvar o lanche")
                    console.log("erro ao editar o lanche: " + erro)
                    res.redirect('/admin/deletar')
                })
            })
        }

    })

    router.post("/edit/bebidas", isAdmin,  (req, res) => {

        let erros = []
    
        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null)
        {
            erros.push({texto: "Nome Inválido"})
        }
        if(!req.body.description || typeof req.body.description == undefined || req.body.description == null)
        {
            erros.push({texto: "Descrição Inválida"})
        }
        if(!req.body.price || req.body.price == 0 || typeof req.body.price == undefined || req.body.price == null)
        {
            erros.push({texto: "Preço Inválido"})
        }
        if(erros.length > 0)
        {
            res.render("admin/editBebidas", {erros: erros})
        }
        else{
            Bebidas.findOne({_id: req.body.id}).then((bebidas) => {
                bebidas.name = req.body.name
                bebidas.price = req.body.price
                bebidas.description = req.body.description
                bebidas.img = req.file.path

                bebidas.save().then(() => {
                    req.flash("success_msg", "Sobremesa Editada com sucesso")
                    res.redirect('/admin/deletar')
                    console.log("bebidas editada com sucesso")
                }).catch((erro) => {
                    req.flash("error_msg", "Houve um erro interno ao salvar a bebida")
                    console.log("erro ao editar a bebidas: " + erro)
                    res.redirect('/admin/deletar')
                })
            })
        }

    })

    router.post("/edit/almoco", isAdmin, (req, res) => {

        let erros = []
    
        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null)
        {
            erros.push({texto: "Nome Inválido"})
        }
        if(!req.body.description || typeof req.body.description == undefined || req.body.description == null)
        {
            erros.push({texto: "Descrição Inválida"})
        }
        if(!req.body.price || req.body.price == 0 || typeof req.body.price == undefined || req.body.price == null)
        {
            erros.push({texto: "Preço Inválido"})
        }
        if(erros.length > 0)
        {
            res.render("admin/editAlmoço", {erros: erros})
        }
        else{
            Almoço.findOne({_id: req.body.id}).then((almoco) => {
                almoco.name = req.body.name
                almoco.price = req.body.price
                almoco.description = req.body.description
                almoco.img = req.file.path

                almoco.save().then(() => {
                    req.flash("success_msg", "Sobremesa Editada com sucesso")
                    res.redirect('/admin/deletar')
                    console.log("Almoço editada com sucesso")
                }).catch((erro) => {
                    req.flash("error_msg", "Houve um erro interno ao salvar o almoço")
                    console.log("erro ao editar o almoço: " + erro)
                    res.redirect('/admin/deletar')
                })
            })
        }

    })

    router.post("/edit/tiragosto", isAdmin,  (req, res) => {

        let erros = []
    
        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null)
        {
            erros.push({texto: "Nome Inválido"})
        }
        if(!req.body.description || typeof req.body.description == undefined || req.body.description == null)
        {
            erros.push({texto: "Descrição Inválida"})
        }
        if(!req.body.price || req.body.price == 0 || typeof req.body.price == undefined || req.body.price == null)
        {
            erros.push({texto: "Preço Inválido"})
        }
        if(erros.length > 0)
        {
            res.render("admin/editTiraGosto", {erros: erros})
        }
        else{
            TiraGosto.findOne({_id: req.body.id}).then((tiragosto) => {
                tiragosto.name = req.body.name
                tiragosto.price = req.body.price
                tiragosto.description = req.body.description
                tiragosto.img = req.file.path

                tiragosto.save().then(() => {
                    req.flash("success_msg", "Tira Gosto Editado com sucesso")
                    res.redirect('/admin/deletar')
                    console.log("Tira Gosto editada com sucesso")
                }).catch((erro) => {
                    req.flash("error_msg", "Houve um erro ao salvar o tiragosto")
                    console.log("erro ao editar o tiragosto: " + erro)
                    res.redirect('/admin/deletar')
                })
            })
        }

    })

    router.get("/usuarios", isAdmin, (req, res) => {
            Contas.find().lean().then((usuario) => {
                res.render("admin/usuarios", {usuario: usuario})
            }).catch((erro) => {
                console.log("houve um erro ao listar os usuarios: " + erro)
            })
    })



module.exports = router;