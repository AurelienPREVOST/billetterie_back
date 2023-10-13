
module.exports = (app, db)=>{
    const NewsletterModel = require('../models/NewsletterModel')(db)

    //route d'enregistrement d'un email à la newsletter
    app.post('/newsletter/add_email', async (req, res, next) => {
      const email = await NewsletterModel.checkIfAllreadySusbscribed(req.body.email)
      if(email.code){
          res.json({status: 500, err: user})
      } else {
        if(email.length > 0){
            res.json({status: 401, msg: "Email déja inscrit à la newsletter"})
        } else {
          let result = await NewsletterModel.saveOneEmail(req)
          if(result.code){
              res.json({status: 500,msg: "L'email n'a pas pu être enregistré", err: result})
          } else {
            res.json({status: 200, msg: "Email ajouté avec succès à la newsletter"})
          }
        }
      }
    })
  }
