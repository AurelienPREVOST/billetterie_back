module.exports = (_db)=>{
  db = _db
  return PlaceModel
}

class PlaceModel {
// enregistrer un nouveau produit
  static saveOnePlace(code, product_id){
    return db.query('INSERT INTO place (code, product_id) VALUES (?, ?)', [code, product_id])
    .then((res)=>{
      return res
    })
    .catch((err)=>{
        return err
    })
  }

  static getAllPlacesByProductId(product_id){
    return db.query('SELECT * FROM place WHERE product_id = ?', [product_id])
    .then((res)=>{
      return res
    })
    .catch((err)=>{
        return err
    })
  }

  static updateSeatStatusToSold(seatId, userId, numOrder) {
    return db.query('UPDATE place SET status = "sold", user_id = ?, order_id = ? WHERE id = ?', [userId, numOrder, seatId])
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err;
    });
  }

  static getAllPlacesByUserId(userId) {
    return db.query('SELECT * FROM `place` INNER JOIN products ON place.product_id = products.id WHERE user_id=?', [userId])
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  static getTicketData(code) {
    return db.query('SELECT * FROM place WHERE code=?', [code])
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  }

  static confirmTicket(code) {
    return db.query('UPDATE place SET status = "SCANNED" WHERE place.code = ?', [code])
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  }
}
