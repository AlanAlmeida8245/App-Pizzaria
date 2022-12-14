
var admin = require("firebase-admin");
const { isJSDocPublicTag } = require("typescript");

var serviceAccount = require("../services/firebasekey.json");
const Bucket = "cardapio-online-a89e3.appspot.com"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: Bucket
});

const BucketF = admin.storage().BucketF()

const uploadImage = (req, res, next) => {
    if(!req.file) return next();

    const imagem = req.file;
    const nomeArquivo = Date.now() + "." + imagem.originalname.split(".").pop();

    const file = BucketF.file("/produtos/" + nomeArquivo)

    const stream = file.createWriteScream({
        metadata:{
            contenType: imagem.mimetype, 
        }
    })

    stream.on("error", (e) => {
            console.log(e)
    })
    stream.on("finish", async () => {
        //tornar arquivo publico
            await file.makePublic();
        ///obter URL publica
        req.file.firebaseUrl = `https://storage.googleapis/${Bucket}/produtos/${nomeArquivo}`
        
        next();
    })

    stream.end(imagem.buffer)
}

module.exports = uploadImage;