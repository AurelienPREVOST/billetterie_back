module.exports = (_db)=>{
  db = _db
  return NewsletterModel
}

class NewsletterModel {

  // enregistrer un nouveau mail à la newsletter
  static saveOneEmail(req){
    return db.query('INSERT INTO newsletter (email) VALUES (?)', [req.body.email])
    .then((res)=>{
      return res
    })
    .catch((err)=>{
      return err
    })
  }

  // Verifie si le mail n'existe pas déja dans la base des mails inscrit à la newsletter
  static checkIfAllreadySusbscribed(email) {
      return db.query("SELECT * FROM newsletter WHERE email = ?", [email])
      .then((res)=>{
          return res
      })
      .catch((err)=>{
          return err
      })
    }
}
