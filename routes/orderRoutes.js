const stripe = require('stripe')('sk_test_51IzetcLJHwOB3xS8Scys4aqt0tTpGSnpiRxPXgZye7zDrOYabfTBw2tJGHfC7BcEZoy8VitDlpjlfG69RICNzKMV00z6pK7PXN')
const withAuth = require('../withAuth')
const mail = require('../lib/mailing');


module.exports = (app, db) => {
    const orderModel = require('../models/OrderModel')(db)
    const productModel = require('../models/ProductModel')(db)
    const userModel = require('../models/UserModel')(db)

    //route de sauvegarde d'une commande
    app.post('/order/save', withAuth, async (req, res, next)=>{
        let totalAmount = 0;
        let orderInfos = await orderModel.saveOneOrder(req.body.user_id, totalAmount)
        let id = orderInfos.insertId
        req.body.basket.map(async (b) => {
            let product = await productModel.getOneProduct(b.id)
            b.safePrice = parseFloat(product[0].price)
            let detail = await orderModel.saveOneOrderDetail(id, b)
            totalAmount += parseInt(b.quantityInCart) * parseFloat(b.safePrice)
            let update = await orderModel.updateTotalAmount(id, totalAmount)
        })
        res.json({status: 200, orderId: id})
    })

    // Payement stripe
    app.post('/order/payment', withAuth, async (req, res, next) => {
      let order = await orderModel.getOneOrder(req.body.orderId);
      // On lance le suivi de paiement
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order[0].totalAmount * 100,
        currency: 'eur',
        metadata: { integration_check: 'accept_a_payment' },
        receipt_email: req.body.email
      });
      res.json({
        client_secret: paymentIntent['client_secret']
      });
    });


    //route de modification du status de paiement de la commande
    app.put('/order/validate', withAuth, async (req, res, next) => {
        //fonction de modification du status de paiement de la commande
        let validate = await orderModel.updateStatus(req.body.orderId, req.body.status)
        if(validate.code){
            res.json({status: 500, msg: "Erreur", err: validate})
        } else {
            res.json({status: 200, msg: "status mis à jour."})
        }
    })

    //route de récupération de toutes les commandes
    app.get('/order/all', withAuth, async (req, res, next) => {
      let orders = await orderModel.getAllOrders()
      if(orders.code){
          res.json({status: 500, msg: "Erreur", err: orders})
      }else{
          res.json({status: 200, result: orders})
      }
    })

    //route de récupération d'une commande
    app.get('/order/getOneOrder/:id', withAuth, async (req, res, next) => {
        //on recup la commande
        let order = await orderModel.getOneOrder(req.params.id)
        if(order.code){
            res.json({status: 500, msg: "Erreur", err: order})
        } else {
            //on recup les infos de l'utilisateur qui a comm
            let user = await userModel.getOneUser(order[0].user_id)
            if(user.code){
                res.json({status: 500, msg: "Erreur", err: user})
            } else {
                //on crée un d'user sans infos sensibles (firstName, lastName, address, zip, city, phone)
                let myUser = {
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    address: user[0].address,
                    zip: user[0].zip,
                    city: user[0].city,
                    phone: user[0].phone
                }
                //on récup les détails de la commande
                let details = await orderModel.getAllDetails(req.params.id)
                if(details.code){
                    res.json({status: 500, msg: "Erreur", err: details})
                } else {
                     //on retourne le json avec mes infos de la commande, de l'utilisateur et des details de la commande
                     res.json({status: 200, order: order[0], user: myUser, orderDetail: details})
                }
            }
        }
    })

    // Route pour récupérer les détails d'une commande par user ID
    app.get('/myorders/:user_id', withAuth, async (req, res, next) => {
      try {
        const userId = req.params.user_id; // Récupérez l'ID de l'utilisateur à partir des paramètres de la route
        const orders = await orderModel.getOrdersByUserId(userId);
        res.json({ status: 200, result: orders });
      } catch (error) {
        res.json({ status: 500, msg: "Erreur", err: error });
      }
    });

    // Route pour récupérer les détails d'une commande par ID
    app.get('/order/getMyOrder/:id', withAuth, async (req, res, next) => {
      try {
        const orderId = req.params.id;
        const orderDetails = await orderModel.getMyOrderDetails(orderId);

        if (orderDetails.code) {
          return res.status(500).json({ status: 500, msg: "Erreur", err: orderDetails });
        }

        return res.json({ status: 200, result: orderDetails });
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la commande :", error);
        return res.status(500).json({ status: 500, msg: "Erreur inattendue", err: error });
      }
    });

    // Route pour avoir les places achetés selon le numero de commande
    app.get('/order/placesInformations/:id', withAuth, async (req, res, next) => {
      try {
        const orderId = req.params.id;
        const orderDetails = await orderModel.getPlacesDetailAboutOrder(orderId);

        if (orderDetails.code) {
          return res.status(500).json({ status: 500, msg: "Erreur", err: orderDetails });
        }

        return res.json({ status: 200, result: orderDetails });
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la commande :", error);
        return res.status(500).json({ status: 500, msg: "Erreur inattendue", err: error });
      }
    });
}
