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

  //Obtenir toute les places disponibles et leurs informations selon l'id du produit
  static getAllPlacesByProductId(product_id){
    return db.query('SELECT * FROM place WHERE product_id = ?', [product_id])
    .then((res)=>{
      return res
    })
    .catch((err)=>{
        return err
    })
  }

  //Modifier le status de la place pour la passé à vendu
  static updateSeatStatusToSold(seatId, userId, numOrder) {
    return db.query('UPDATE place SET status = "sold", user_id = ?, order_id = ? WHERE id = ?', [userId, numOrder, seatId])
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err;
    });
  }

  //Obtenir toutes les places achetés par un utilisateur
  static getAllPlacesByUserId(userId) {
    return db.query('SELECT * FROM `place` INNER JOIN products ON place.product_id = products.id WHERE user_id=?', [userId])
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  //Obtenir les infos d'une place en fonction de son code
  static getTicketData(code) {
    return db.query('SELECT * FROM place WHERE code=?', [code])
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  }

  //Passe le status du ticket à scanné pour qu'il ne soit plus réutilisable
  static confirmTicket(code) {
    return db.query('UPDATE place SET status = "SCANNED" WHERE place.code = ?', [code])
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  }

  // Verifie que les places sont toujours à vendre
  static checkThanPlacesAreNotAllreadySold(code) {
    return db.query('SELECT user_id FROM place WHERE code = ?', [code])
    .then((res) => {
      console.log("checkThanPlacesAreNotAllreadySold", res)
      if (res.result !== null) {
        console.log("TROP TARD! une de vos place selectionné a été vendu, vous n'avez pas validé votre panier assez rapidement")
      } else {
        console.log("les places sont toutes pour vous")
      }
      return res;
    })
    .catch((err) => {
      return err;
    });
  }
}
