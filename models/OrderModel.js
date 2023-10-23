module.exports = (_db)=>{
  db = _db
  return OrderModel
}

class OrderModel {
  //validation d'une commande
  static saveOneOrder(user_id, totalAmount){
    //le status sera "not payed" par défault
    return db.query('INSERT INTO orders (user_id, totalAmount, creationTimestamp, status) VALUES (?, ?, NOW(), "not payed")', [user_id, totalAmount])
    .then((response)=>{
        return response
    })
    .catch((err) => {
        return err
    })
  }


  //sauvegarde d'un orderDetail
  static saveOneOrderDetail(order_id, product){
      let total = parseInt(product.quantityInCart)*parseFloat(product.safePrice)
      return db.query('INSERT INTO orderdetails (order_id, product_id, quantity, total) VALUES (?,?,?,?)', [order_id, product.id, product.quantityInCart, total])
      .then((response)=>{
          return response
      })
      .catch((err) => {
          return err
      })
  }

  //modification du montant total
  static updateTotalAmount(order_id, totalAmount){
    return db.query('UPDATE orders SET totalAmount = ? WHERE id = ?', [totalAmount, order_id])
    .then((response)=>{
        return response
    })
    .catch((err) => {
        return err
    })
  }

  static getPlacesDetailAboutOrder(id) {
    return db.query('SELECT * FROM `place` WHERE order_id=?', [id])
    .then((res)=>{
      console.log("*************************")
      console.log("getPlacesDetailAboutOrder le res => ", res)
      return res
    })
    .catch((err)=>{
        return err
    })
  }

  //récupération d'une commande en fonction d'un id
  static getOneOrder(id){
    return db.query('SELECT * FROM orders WHERE id = ?', [id])
    .then((res)=>{
        return res
    })
    .catch((err)=>{
        return err
    })
  }

  //modification d'un status de commande
  static updateStatus(orderId, status){
    return db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId])
    .then((response)=>{
        return response
    })
    .catch((err) => {
        return err
    })
  }

  //récupération de toutes les commandes
  static getAllOrders(){
      return db.query('SELECT * FROM orders WHERE status="payed"')
      .then((res)=>{
          return res
      })
      .catch((err)=>{
          return err
      })
  }

  //récupération des détails d'une commande
  static getAllDetails(orderId){
      let order = 'SELECT orderdetails.id, orderdetails.quantity, total, name, description, photo FROM orderdetails INNER JOIN products ON products.id = orderdetails.product_id WHERE order_id = ?'
      return db.query(order, [orderId])
      .then((response)=>{
          return response
      })
      .catch((err) => {
          return err
      })
  }

  // Récupérer toutes les commandes d'un utilisateur en fonction de son ID
  static getOrdersByUserId(userId) {
    return db.query('SELECT * FROM orders WHERE user_id = ?', [userId])
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}
