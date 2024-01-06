const fs = require('fs')//va nous permettre de supprimer des images locales
const withAuth = require('../withAuth')
const adminAuth = require('../adminAuth')
const { machine } = require('os')

module.exports = (app,db)=>{

      const productModel = require('../models/ProductModel')(db)
      const placeModel = require('../models/PlaceModel')(db)

      /////////////////////////////////////////
      const generateCode = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = ''
      for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      code += characters.charAt(randomIndex)
      }
      return code;
      }
      /////////////////////////////////////////

      //routes permettant de récuperer tout les produits
      app.get('/product/all', async (req, res, next) => {
    	let products = await productModel.getAllProducts()
    	if(products.code){
    		res.json({status: 500, msg: "il y'a eu un problème", err: products})
    	}else{
    		res.json({status: 200, result: products})
    	}
    })


    //ROUTE POUR AFFICHAGE de PRODUCT  PAR tYPE
    app.get('/product/type/:type', async (req, res) => {
      productModel
        .getAllProductsType(req.params.type)
        .then((result) => {
          res.json({ status: 200, result });
        })
        .catch((error) => {
          res.json({ status: 500, msg: "Il y a eu un problème", err: error });
        });
    });

    // Route permettant de créer un nouveau produit
    // ATTENTION TOKEN RETIRE adminAuth
    app.post('/product/new', async (req, res, next) => {
    	let product = await productModel.saveOneProduct(req)
    	if(product.code){
    		res.json({status: 500, msg: "il y'a eu un problème", err: product})
    	}else{
        let nbPlaces = req.body.quantity
        let errors = 0
        // ilf aut boucler uatant de fois que le nombre de places
        for (let i = 0; i < nbPlaces; i++){
          let code = generateCode()
          let place = await placeModel.saveOnePlace(code, product.insertId)
          if(place.code){
            errors += 1
          }
        }
        if (errors === 0){
          res.json({status: 200, msg: "Le produit a été enregistré et toutes les places ont été créées!", result: product})
        } else {
          res.json({status: 500, msg: `il y'a eu un problème dans la création des places, mais le spectacle a bien été créé `, product: product})
        }
    	}
    })

    //route permettant de modifier un produit
    app.put('/product/update/:id', async (req, res, next) => {
      let product = await productModel.updateOneProducts(req, req.params.id)
      if(product.code){
        res.json({status: 500, msg: "il y'a eu un problème", err: product})
      }else{
        res.json({status: 200, msg: "Produit modifié!", result: product})
      }
    })

    //route permettant de supprimer un produit
    app.delete('/product/delete/:id', async (req, res, next) => {
      let deleteProduct = await productModel.deleteOneProducts(req.params.id)
      if(deleteProduct.code){
        res.json({status: 500, msg: "il y'a eu un problème", err: product})
      }else{
        res.json({status: 200, msg: "Produit supprimée", result: deleteProduct})
      }
    })

///////////// ROUTE SPECIALE //////////////////

      //route d'ajout d'une image dans l'api (stock une image et retourne au front le nom de l'image stocké)
    app.post('/api/v1/product/pict', adminAuth, (req, res, next) =>{
        //si on a pas envoyé de req.files via le front ou que cet objet ne possède aucune propriété
    if (!req.files || Object.keys(req.files).length === 0) {
      //on envoi une réponse d'erreur
          res.json({status: 400, msg: "La photo n'a pas pu être récupérée"})
      }
      //la fonction mv va envoyer l'image dans le dossier que l'on souhaite.
      req.files.image.mv('public/images/'+req.files.image.name, function(err) {
        console.log('enregistrement image', '/public/images/'+req.files.image.name)
        //si ça plante dans la callback
        if (err) {
        //renvoi d'un message d'erreur
          res.json({status: 500, msg: "La photo n'a pas pu être enregistrée"})
        }
      });
      //si c'est good on retourne un json avec le nom de la photo vers le front
        res.json({status: 200, msg: "image bien enregistré!", url: req.files.image.name})
    })


    // Route de recherche d'events via keyword partiel depuis la searchBar
    app.get('/event', async (req, res, next) => {
      const keyword = req.query.PartialQuery
      try {
        const events = await productModel.getAllProductsWhereNameLooksLike(keyword)
        res.json({ status: 200, result: events })
      } catch (error) {
        res.status(500).json({ status: 500, msg: "Il y a eu un problème", err: error })
      }
    });
}
