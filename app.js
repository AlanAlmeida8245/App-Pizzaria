const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")
const admin = require("./routes/admin")
const users = require("./routes/users")
const mongoose = require("mongoose")
const multer = require("multer")
const upload = multer({dest: 'uploads/products/'})
const session = require("express-session")
const flash = require("connect-flash")
const cors = require("cors")
const fs = require("fs")
const { JSDOM } = require("jsdom");
const myJSDom = new JSDOM
const $ = require('jquery')(myJSDom.window);
const passport = require("passport")
require("./config/auth")(passport)




    //se conectando ao banco de dados
    mongoose.Promisse = global.Promisse;
    mongoose.connect("mongodb://localhost/projeto").then((req, res) => {
        console.log("Conectado ao Banco de Dados")
        }).catch((error) => {
        console.log("Erro ao se conectar ao banco de dados: " + error)
    })


    const categorias = mongoose.Schema({
        nome:{
            type: String,
            required: true
        }
    })
   
    
    //Configurações
        //public
        app.use(express.static(path.join(__dirname, "public")))
        app.use("/uploads", express.static("uploads"))

        app.use(session({
            secret: "cardapio",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
         app.use(flash())
        
       

        //middlewares
            app.use((req, res, next) => {
                res.locals.success_msg = req.flash("success_msg");
                res.locals.error_msg = req.flash("error_msg");
                res.locals.error = req.flash("error");
                res.locals.sucesso = req.flash("sucesso")
                if (req.user) {
                    res.locals.user = req.user.toObject();
                  }
                next();
            })



            //bodyParser
            
           app.use(bodyParser.urlencoded({extended: true}))
           app.use(cors());
           app.use(bodyParser.json())
           //Handlebars
            app.engine('handlebars', handlebars.engine({
                defaultLayout: 'main',
                runtimeOptions: {
                    allowedProtoPropertiesByDefault: true,
                    allowedProtoMethodsByDefault: true,
                    allowedProtoMethods: {
                        trim: true
                      }
                }
            }))
            app.set("view engine", 'handlebars');
           
            app.use('/admin', admin)
            app.use('/clientes', users)

            app.use("/", (req, res) => {
                 res.render("home/homepage")
           })

          

            //rotas
            


app.listen(process.env.PORT || 8082, () => {
    console.log("Servidor Aberto na Porta 8082");
})