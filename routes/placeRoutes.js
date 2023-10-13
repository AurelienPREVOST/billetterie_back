const fs = require('fs')//va nous permettre de supprimer des images locales
const withAuth = require('../withAuth')
const adminAuth = require('../adminAuth')
const { machine } = require('os')

module.exports = (app,db)=>{

  const placeModel = require('../models/PlaceModel')(db)

  //routes permettant de récuperer tout les produits
  app.get('/place/all/product/:id', async (req, res, next) => {
    let places = await placeModel.getAllPlacesByProductId(req.params.id)
    if(places.code){
      res.json({status: 500, msg: "il y'a eu un problème", err: places})
    }else{
      res.json({status: 200, result: places})
    }
  })




      //routes TEST POUR LE NOMBRE DE PLACE
      // app.get('/placesAvailable/:test', async (req, res, next) => {
      //   let placesAvailable = await placeModel.getPlacesAvailable(req.params.test)
      //   if(placesAvailable.code){
      //     res.json({status: 500, msg: "Oops", err: placesAvailable})
      //   }else{
      //     res.json({status: 200, result: placesAvailable})
      //   }
      // })
            app.get('/placesAvailable/', async (req, res, next) => {
        let placesAvailable = await placeModel.getPlacesAvailable()
        if(placesAvailable.code){
          res.json({status: 500, msg: "Oops", err: placesAvailable})
        }else{
          res.json({status: 200, result: placesAvailable})
        }
      })



///////////TENTATIVE DE ROUTES VERS LE MODEL POUR LES SEATAPI A REMETTRE SI LA NOUVELLE VERSION NE MARCHE PAS
//   app.put('/place/updateseat/:id', async (req, res, next) => {
//     try {
//       const { id } = req.params;
//       await placeModel.updateSeatStatusToSold(id);
//       res.json({ status: 200, msg: "La mise à jour du statut a réussi." });
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour du statut :", error);
//       res.status(500).json({ status: 500, msg: "Erreur lors de la mise à jour du statut.", err: error });
//     }
//   });
// }

  app.put('/place/updateseat/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { clientId } = req.body; // Ajoutez ceci pour récupérer l'ID du client depuis le corps de la requête

      // Maintenant, vous avez à la fois l'ID de la place à mettre à jour et l'ID du client
      // Vous pouvez utiliser ces informations pour effectuer la mise à jour dans votre base de données

      // Exemple : mettez à jour la place avec l'ID du client
      await placeModel.updateSeatStatusToSold(id, clientId);

      res.json({ status: 200, msg: "La mise à jour du statut a réussi." });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      res.status(500).json({ status: 500, msg: "Erreur lors de la mise à jour du statut.", err: error });
    }
  });


  app.get('/places/:userId', async (req, res) => {

    try {
      const { userId } = req.params;
      const userPlaces = await placeModel.getAllPlacesByUserId(userId);
      res.status(200).json(userPlaces);
    } catch (error) {
      console.error("Erreur lors de la récupération des places de l'utilisateur :", error);
      res.status(500).json({ status: 500, msg: "Erreur lors de la récupération des places de l'utilisateur.", err: error });
    }
  });




////////////////////////
  app.get('/place/checking/:id', async (req, res, next) => {
    let places = await placeModel.getTicketData(req.params.id)
    if(places.code){
      res.json({status: 500, msg: "erreur dans placeRoute /place/checking/X", err: places})
    }else{
      res.json({status: 200, result: places})
    }
  })

  app.put('/place/firstscan/:code', async (req, res, next) => {
    try {
      const { code } = req.params;
      await placeModel.confirmTicket(code);
      res.json({ status: 200, msg: "Statut modifié de sold à SCANNED" });
    } catch (error) {
      console.error("erreur lors du scan:", error);
      res.status(500).json({ status: 500, msg: "L'entrée à deja été scannée", err: error });
    }
  });
}
