
if(process.env.NODE.ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://alanalmeida:82450225@cluster0.4udxzwa.mongodb.net/?retryWrites=true&w=majority"}

}else{
    module.exports = {mongoURI: "mongodb://localhost/projeto"}
}