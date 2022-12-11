const localStrategy  = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("../models/Contas")
const Contas = mongoose.model("contas")

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"},  (email, senha, done) => {

        Contas.findOne({email: email}).lean().then((usuario) => {
            if(!usuario){
                    return done(null, false, {message: "essa conta não existe"})
            }

            bcrypt.compare(senha, usuario.password, (error, batem) => {
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done ) => {
        done(null, usuario)
     })

     passport.deserializeUser((id, done) => {
        Contas.findById(id, (error, usuario) => {
                done(error, usuario)
        })
     })
}
