
if(process.env.NODE.ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://AlanAlmeida8245:82450225@blogapp.wqa7kil.mongodb.net/?retryWrites=true&w=majority"}

}else{
    module.exports = {mongoURI: "mongodb://localhost/projeto"}
}
