const fs = require('fs')//va nous permettre de supprimer des images locales
const withAuth = require('../withAuth')
const adminAuth = require('../adminAuth')
const { machine } = require('os')
const mail = require('../lib/mailing');
const UserModel = require('../models/UserModel');
const QRCode = require('qrcode');


module.exports = (app,db)=>{

  const placeModel = require('../models/PlaceModel')(db)
  const userModel = require('../models/UserModel')(db)


  //routes permettant de récuperer tout les produits
  app.get('/place/all/product/:id', async (req, res, next) => {
    let places = await placeModel.getAllPlacesByProductId(req.params.id)
    if(places.code){
      res.json({status: 500, msg: "il y'a eu un problème", err: places})
    }else{
      res.json({status: 200, result: places})
    }
  })


  app.get('/placesAvailable/', async (req, res, next) => {
    let placesAvailable = await placeModel.getPlacesAvailable()
    if(placesAvailable.code){
      res.json({status: 500, msg: "Oops", err: placesAvailable})
    }else{
      res.json({status: 200, result: placesAvailable})
    }
  })


  app.put('/place/updateseat/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { clientId, numOrder } = req.body;

      await placeModel.updateSeatStatusToSold(id, clientId, numOrder);
      const sql = 'SELECT place.code FROM place WHERE place.user_id = ? AND place.order_id = ?';
      db.query(sql, [clientId, numOrder], async (error, results) => {
        if (error) {
          console.error('Erreur lors de la requête SQL :', error);
          res.status(500).json({ status: 500, msg: "Erreur lors de la mise à jour du statut.", err: error });
        } else {
          const codes = results.map(result => result.code);
          console.log("codes", codes);
          const emailClient = await userModel.getEmailById(clientId);
          const codeElements = codes.map((code, index) => `<li key=${index}><a href="http://127.0.0.1:5173/emailPlaces/code=${code}">${code}</a></li>`);
          const emailContent = `
            <p>Vos places pour votre évènement :</p>
            <ul>
              ${codeElements.join('')}
            </ul>
            <p>Pour afficher votre place, rendez-vous sur votre <a href="http://127.0.0.1:5173/profil">profil</a> ou bien cliquez sur les liens ci-dessus</p>
          `;

          mail(
            emailClient[0].email,
            "Vos places pour votre évènement",
            emailContent
          );

          res.json({ status: 200, msg: "La mise à jour du statut a réussi.", codes });
        }
      });
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
