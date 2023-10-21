// BACK routes/userRoutes.js

const bcrypt = require('bcrypt')
const saltRounds = 10
//librairie qui va générer un token de connexion
const jwt = require('jsonwebtoken')
const secret = 'user_secret'
const withAuth = require('../withAuth')
const mail = require('../lib/mailing');


module.exports = (app, db)=>{
    const userModel = require('../models/UserModel')(db)

    //route d'enregistrement d'un utilisateur
    app.post('/user/save', async (req, res, next) => {
      const user = await userModel.getUserByEmail(req.body.email)

      if(user.code){
          res.json({status: 500, err: user})
      } else {
          if(user.length > 0){
              res.json({status: 401, msg: "Email déjà utilisé!"})
          } else {
              let result = await userModel.saveOneUser(req)
              if(result.code){
                  res.json({status: 500,msg: "echec requète", err: result})
              } else {
                  mail(
                      req.body.email,
                      "Validation de votre compte Billetterie",
                      "Bienvenue sur votre billetterie",
                      `Pour valider votre mail, cliquez <a href="http://localhost:9000/user/validate/${result.key_id}">ici</a>!`
                  )
                  res.json({status: 200, msg: "Utilisateur bien enregistré!"})
              }
          }
      }
    })

      //route de connexion d'un utilisateur (c'est ici qu'on va creer le token et l'envoyer vers le front)
      app.post('/user/login', async (req, res, next)=>{
      if(req.body.email === ""){
          res.json({status: 401, msg: "Entrez un email..."})
      } else {
        //on check si il existe un utilisateur dans la bdd avec un mail correspondant
        let user = await userModel.getUserByEmail(req.body.email)
        if(user.code){
          res.json({status: 500, msg: "Erreur verification email.", err: user})
        }else{
          //si il n'existe pas
          if(user.length === 0){
            res.json({status:404, msg: "Aucun utilisateur correspondant"})
          } else {
            //la bdd a retournee un objet d'utilisateur pour ce mail
            //on compare les password avec bcrypt
            let same = await bcrypt.compare(req.body.password, user[0].password)
            //si c'est true, les mdp sont identiques
            if(same){
              //on va creer le payload du token, dans ce payload on stock les valeurs qu'on va glisser dans le token (attention jamais d'infos craignos)
              const payload = {email: req.body.email, id: user[0].id, role: user[0].role}
              //on cree notre token avec sa signature (secret)
              const token = jwt.sign(payload, secret)
              let connect = await userModel.updateConnexion(user[0].id)
              if(connect.code){
                res.json({status: 500, errr: connect})
              } else {
                res.json({status: 200, token: token, user: user[0]})
              }
            }else{
              res.json({status: 401, msg: "Votre mot de passe est incorrect!"})
            }
          }
        }
      }
    })

    app.put('/user/update/:id', withAuth, async (req, res, next) => {
      let user = await userModel.updateUser(req, req.params.id)
      if(user.code){
          res.json({status: 500, msg: "Probleme dans le update user NODE", err: user})
      }else{
          //mon profil est modifié je renvoi les infos du profil mis à jour vers le front (pour que redux mette à jour immédiatement les infos d'utilisateurn connecté)
          let newUser = await userModel.getOneUser(req.params.id)
          if(newUser.code){
              res.json({status: 500, msg: "Probleme dans le update use NODE après le getOneUser", err: newUser})
          } else {
              res.json({status: 200, result: user, newUser: newUser[0]})
          }
      }
    })


    //route de demande de récupération de mot de pass oublié
    app.post('/user/forgot', async (req, res, next) => {
      let user = await userModel.getUserByEmail(req.body.email)
      if(user.code){
          res.json({status: 500, msg: "Nous n'avons pas pu envoyer un mail...", error: user})
      } else {
          if(user.length === 0){
              res.json({status: 404, msg: "Nous n'avons pas d'utilisateur pour ce mail", error: user})
          } else {
              //optionnel on change le key_id (securité supplémentaire)
              let result = await userModel.updateKeyId(req.body.email)
              if(result.code){
                    res.json({status: 500, msg: "Nous n'avons pas pu envoyer de mail...", error: result})
              }else{
                  let key_id = result.key_id

                  mail(
                      req.body.email,
                      "changement de mot de passe",
                      "Mot de passe oublié ?",
                      `Pour modifier votre mot de passe, cliquez <a href="http://127.0.0.1:5173/user/changePassword/${key_id}">ici</a>!`
                  )
                  res.json({status: 200, msg: "Email envoyé!"})
              }
          }
      }
    })

    //route de validation d'un utilisateur (par son key_id)
    app.get('/user/validate/:key_id', async (req, res, next) => {
      let key_id = req.params.key_id
      //on update la colonne validate de no à yes
      let validate = await userModel.updateValidateUser(key_id)
      if(validate.code){
        res.json({status: 500, error: validate})
      } else {
        //ici on pourrait rediriger vers le front
        // res.json({status: 200, msg: "compte utilisateur validé"}) // Renvoi un json
        res.redirect('http://127.0.0.1:5173/accountValidate'); // je renvoi vers un front non custom de validation
      }
    })

  //route d'affichage du template de modification de password (ejs)
  app.get('/user/changePassword/:key_id', async (req, res, next) => {
    res.render('changePassword', {key_id: req.params.key_id, error: null})
  })

  //route de modification du mot de passe
  app.post('/user/changePassword/:key_id', async (req, res, next) => {
    let password= req.body.password
    let key_id = req.body.key_id;
  //password et key_id sont ok et bien recu du front
    let result = await userModel.updatePassword(password, key_id);
    console.log("result de await userModel.updatePassword =", result)
    if (result.code) {
      res.json({status: 500, msg: "Erreur à la reinitialisation du mot de passe", error: result})
    } else {
      // res.render('changePasswordSuccess')
      res.redirect('http://127.0.0.1:5173/user/changePasswordSuccess');
    }
  })
}
