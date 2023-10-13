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
        //enregistrement de l'order (fonction)
        let orderInfos = await orderModel.saveOneOrder(req.body.user_id, totalAmount)
        //on récup dans l'objet de réponse l'insertId (l'id qu'il vient d'insérer dans le bdd)
        let id = orderInfos.insertId
        //on boucle sur le panier passé dans req.body.basket (pour enregistrer le detail de chaque produit)
        req.body.basket.map(async (b) => {
            //on récup les infos d'un produit par son id (on stock dans une variable product)
            let product = await productModel.getOneProduct(b.id)
            //on ajoute une propriété safePrice à l'objet du tour de boucle en lui affectant le prix de product en chiffre à virgule
            b.safePrice = parseFloat(product[0].price)
            //on appel la fonction pour sauvegarder un détail de cette commande en envoyant l'id de la commande et le produit du tour de boucle
            let detail = await orderModel.saveOneOrderDetail(id, b)
            //on additionne au totalAmount la quantité du produit demandé multiplié par le safePrice
            totalAmount += parseInt(b.quantityInCart) * parseFloat(b.safePrice)
            //on met à jour le montant total de la commmande (fonction)
            let update = await orderModel.updateTotalAmount(id, totalAmount)
        })
        //on retourne le json de 200 avec l'id de la commande qu'on vient d'enregistrer
        res.json({status: 200, orderId: id})
    })

                  // //route de gestion du paiement (va analyser le bon fonctionnement du paiement (suivi))
                  // app.post('/order/payment', withAuth, async (req, res, next)=>{
                  //     let order = await orderModel.getOneOrder(req.body.orderId)
                  //     //on lance le suivi de paiement
                  //     const paymentIntent = await stripe.paymentIntents.create({
                  //         amount: order[0].totalAmount*100, //il est en cts donc on mutiplie le montant à payer par 100
                  //         currency: 'eur', //indique la devise de paiement à effectuer
                  //         metadata: {integration_check: 'accept_a_payment'},//on consulte si le paiement est accepté ou non
                  //         receipt_email: req.body.email //l'utilisateur recoit sa confirmation de paiement par email
                  //     })
                  //     res.json({
                  //       client_secret: paymentIntent['client_secret']
                  //     })
                  // })

                  // test de mail de confirmation d'achat
                  app.post('/order/payment', withAuth, async (req, res, next) => {
                    let order = await orderModel.getOneOrder(req.body.orderId);
                    console.log("---------------------------------------------------------------------")
                    console.log("req =>", req)
                    console.log("---------------------------------------------------------------------")
                    console.log("res =>", res)
                    console.log("---------------------------------------------------------------------")
                    console.log("order =>", order)
                    // On lance le suivi de paiement
                    const paymentIntent = await stripe.paymentIntents.create({
                      amount: order[0].totalAmount * 100, // Il est en centimes, donc on multiplie par 100
                      currency: 'eur', // Indique la devise de paiement à effectuer
                      metadata: { integration_check: 'accept_a_payment' },
                      receipt_email: req.body.email // L'utilisateur reçoit sa confirmation de paiement par email
                    });

                    // Ici, vous pouvez envoyer l'email de confirmation de commande
                    mail(
                      req.body.email,
                      "Vos places pour votre évènement",
                      "Veuillez trouver ci-joint vos places pour votre événement",
                      "insertion d'une image en base 64"
                    );

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
}
