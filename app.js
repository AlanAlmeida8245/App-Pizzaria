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
const cookie = require("cookie-session")
const $ = require('jquery')(myJSDom.window);
const passport = require("passport")
const MongoStore = require('connect-mongo');
require("./config/auth")(passport)
const imgur = require("imgur")
const fileUpload = require("express-fileupload")



    //se conectando ao banco de dados
    mongoose.Promisse = global.Promisse;
    mongoose.connect("mongodb+srv://AlanAlmeida8245:82450225@blogapp.wqa7kil.mongodb.net/?retryWrites=true&w=majority").then((req, res) => {
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
    app.use(cors());
    app.use(fileUpload())
        //public
        app.use(express.static(path.join(__dirname, "public")))
        app.use("/uploads", express.static("uploads"))

        app.set('trust proxy', 1);

        app.use(session({
        cookie:{
            secure: true,
            maxAge:60000
               },
               store: MongoStore.create({mongoUrl: 'mongodb+srv://AlanAlmeida8245:82450225@blogapp.wqa7kil.mongodb.net/?retryWrites=true&w=majority'}),
        secret: 'cardapio',
        saveUninitialized: true,
        resave: false
        }));
        
        app.use(function(req,res,next){
        if(!req.session){
            return next(new Error('Oh no')) //handle error
        }
        next() //otherwise continue
        });

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