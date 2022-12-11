module.exports = {
    isAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.Admin == true){
            return next();
        }
        req.flash('error', "Você Não é um Administrador")
        res.redirect("/");
    }
}

