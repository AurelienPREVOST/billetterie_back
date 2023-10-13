const express = require("express")
const app = express()

const mysql = require("promise-mysql")
const cors = require("cors")

app.use(cors())

const fileUpload = require("express-fileupload")

app.use(fileUpload({
    createParentPath: true
}))

//parse les url
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(__dirname+'/public'))

let config;
//on check si l'api est en ligne (sur un server) ou non et on décide quelle bdd on va utiliser.
if(!process.env.HOST){
    //il ne detecte pas de variable d'environnement au nom de HOST, nous sommes en local
    config = require("./config-offline")
} else {
    //il a détecté une variable d'environnement au nom de HOST, nous sommes en ligne
    config = require("./config")
}

//connexion à la bdd
const host = process.env.HOST || config.db.host
const database = process.env.DATABASE_DB || config.db.database
const user = process.env.USER_DB || config.db.user
const password = process.env.PASSWORD || config.db.password
//const port = process.env.PORT || config.db.port (pour ceux qui uitilisent mamp (port 8889) par défaut il est sur le port 3306)

//on importe nos routes
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const placeRoutes = require('./routes/placeRoutes')
const newsletterRoutes = require('./routes/newsletterRoutes')


//connexion à la bdd
mysql.createConnection({
    host: host,
    database: database,
    user: user,
    password: password
    //port: port (pour mamp MAC)
}).then((db)=>{
    setInterval(async ()=>{
        let res = await db.query('SELECT 1')
    }, 10000)

    app.get('/', async (req, res, next)=>{
        res.json({status: 200, msg: "connexion root okay"})
    })

    //appel de nos routes
    userRoutes(app, db)
    authRoutes(app, db)
    productRoutes(app, db)
    orderRoutes(app, db)
    placeRoutes(app,db)
    newsletterRoutes(app,db)
})
.catch(err=>console.log("Echec connexion", err))

const PORT = process.env.PORT || 9000

app.listen(PORT, ()=>{
    console.log(`listening port ${PORT}`)
})
