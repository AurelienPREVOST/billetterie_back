const jwt = require('jsonwebtoken')
const secret = "user_secret"

const adminAuth = (req, res, next) => {
    //on récupère notre token dans le header de la requète HTTP
    const token = req.headers['x-access-token']
    console.log("token", token)

    //si il ne trouve pas de token
    if(token === undefined){
        console.log("1")
        res.json({status: 404, msg: "error, token not found."})
    } else {
        console.log("2")
        //sinon il a trouvé un token, utilisation de la fonction de vérification du token
        jwt.verify(token, secret, (err, decoded)=>{
            if(err){
                console.log("3")
                res.json({status: 401, msg: "error: your token is invalid."})
            } else {
                console.log("4")
                //le token est vérifié et valide
                //on rajoute une propriété id dans req, qui récupère l'id du token décrypté
                req.id = decoded.id
                if(decoded.role === "admin"){
                    console.log("5")
                    //on sort de la fonction, on autorise l'accés à la callback de la route back demandée
                    next()
                } else {
                    console.log("6")
                    res.json({status: 401, msg: "error, you are not ADMIN"})
                }
            }
        })
    }
}

module.exports = adminAuth
