module.exports = {
    isLogado: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', "Você precisa Estar Logado")
        res.redirect("/clientes/login");
    }
}

