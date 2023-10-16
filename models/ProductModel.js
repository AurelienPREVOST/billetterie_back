module.exports = (_db)=>{
  db = _db
  return ProductModel
}

class ProductModel {
    static getAllProducts(){
      // return db.query('SELECT * FROM products')
      return db.query('SELECT products.*, COALESCE(place_count, 0) AS count FROM products LEFT JOIN (SELECT product_id, COUNT(*) AS place_count FROM place WHERE user_id IS NULL GROUP BY product_id) AS place_counts ON products.id = place_counts.product_id')
      .then((res)=>{
          return res
      })
      .catch((err)=>{
          return err
      })
    }

    /////TEST PRODUCT WIDGET
    static getAllProductsType(type) {
      return db.query('SELECT * FROM products WHERE type=?', [type])
      .then((res)=>{
        return res
      })
      .catch((err)=>{
          return err
      })
    }
    ///FIN TEST

      //récupération d'un seul produit
    static getOneProduct(id){
      return db.query('SELECT * FROM products WHERE id = ?', [id])
      .then((res)=>{
          return res
      })
      .catch((err)=>{
          return err
      })
    }

    // enregistrer un nouveau produit
    static saveOneProduct(req){
      return db.query('INSERT INTO products (name, type, description, latitude, longitude, ville, lieu, date, price, photo, quantity, creationTimestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [req.body.name, req.body.type, req.body.description, req.body.latitude, req.body.longitude, req.body.ville, req.body.lieu, req.body.date, req.body.price, req.body.photo, req.body.quantity])
      .then((res)=>{
        return res
      })
      .catch((err)=>{
          return err
      })
    }

    static updateOneProducts(req, id){
      return db.query('UPDATE products SET name=? , type=?, description=?, latitude=?, longitude=?, ville=?, lieu=?, date=?, price=?, photo=?, quantity=? WHERE id=?', [req.body.name, req.body.type, req.body.description, req.body.latitude, req.body.longitude, req.body.ville, req.body.lieu, req.body.date, req.body.price, req.body.photo, req.body.quantity, id])
      .then((res)=>{
          return res
      })
      .catch((err)=>{
          return err
      })
  }

    //suppression d'un produit
    static deleteOneProducts(id){
      return db.query('DELETE FROM products WHERE id=?', [id])
      .then((response)=>{
          return response
      })
      .catch((err)=>{
          return err
      })
  }

    static async getAllProductsWhereNameLooksLike(keyword) {
      try {
        const sql = 'SELECT * FROM products WHERE name LIKE ?';
        const searchTerm = `%${keyword}%`;

        const response = await db.query(sql, [searchTerm]);

        return response;
      } catch (error) {
        console.error("Error in getAllProductsWhereNameLooksLike:", error);
        throw error
      }
    }
}
