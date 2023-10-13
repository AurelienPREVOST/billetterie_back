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

  static updateSeatStatusToSold(seatId, userId) {
    return db.query('UPDATE place SET status = "sold", user_id = ? WHERE id = ?', [userId, seatId])
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


        ///////////TEST

          //   static getPlacesAvailable(test) {
          //   return db.query('SELECT COUNT(*) FROM place WHERE product_id = ? AND user_id IS NULL', [test])
          //   .then((res) => {
          //     return res;
          //   })
          //   .catch((err) => {
          //     return err;
          //   });
          // }


                    ///TEST AVEC OLIV
                    // static getPlacesAvailable() {
                    //   return db.query('SELECT products.id, COUNT(*) FROM products LEFT JOIN place ON products.id = place.product_id WHERE place.user_id IS NULL GROUP BY products.id')
                    //   .then((res) => {
                    //     console.log("RES DE GETPLACESAVAILABLE=>", res)
                    //     return res;
                    //   })
                    //   .catch((err) => {
                    //     console.log("oops")
                    //     return err;
                    //   });
                    // }


                    // static getPlacesAvailable() {
                    //   return db.query('SELECT products.*, COALESCE(place_count, 0) AS count FROM products LEFT JOIN (SELECT product_id, COUNT(*) AS place_count FROM place WHERE user_id IS NULL GROUP BY product_id) AS place_counts ON products.id = place_counts.product_id')
                    //     .then((res) => {
                    //       console.log("RES DE GETPLACESAVAILABLE=>", res);
                    //       return res;
                    //     })
                    //     .catch((err) => {
                    //       console.log("Oops", err);
                    //       return err;
                    //     });
                    // }
}
