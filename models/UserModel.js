const bcrypt = require('bcrypt')
const saltRounds = 10
let randomId = require('random-id');
let len = 30;
let pattern = 'aA0'

module.exports = (_db)=>{
    db=_db
    return UserModel
}

class UserModel {
    //sauvegarde d'un membre
    static saveOneUser(req){
      return bcrypt.hash(req.body.password, saltRounds)
      .then((hash)=>{
          const key_id = randomId(len, pattern);
          return db.query('INSERT INTO users (firstName, lastName, email, password, role, address, zip, city, phone, creationTimestamp, validate, key_id) VALUES (?, ?, ?, ?, "user", ?, ?, ?, ?, NOW(), "no", ?)', [req.body.firstName, req.body.lastName, req.body.email, hash, req.body.address, req.body.zip, req.body.city, req.body.phone, key_id])
          .then((res)=>{
            res.key_id = key_id // on ajoute à l'objet la valeur key_id, sans ca key_id sera undefined
            return res
          })
          .catch((err)=>{
              return err
          })
      })
      .catch((err)=>console.log(err))
    }


    //récupération d'un utilisateur en fonction de son mail
    static getUserByEmail(email){
      return db.query("SELECT * FROM users WHERE email = ?", [email])
      .then((res)=>{
          return res
      })
      .catch((err)=>{
          return err
      })
    }

    //récupération d'un utilisateur par son id
    static getOneUser(id){
      return db.query("SELECT * FROM users WHERE id = ?", [id])
      .then((res)=>{
        return res
      })
      .catch((err)=>{
        return err
      })
    }

    //modification d'un utilisateur
    static updateUser(req, userId){
      return db.query("UPDATE users SET firstName = ?, lastName = ?, address = ?, zip = ?, city = ?, phone = ? WHERE id = ?", [req.body.firstName, req.body.lastName, req.body.address, req.body.zip, req.body.city, req.body.phone, userId])
      .then((res)=>{
          return res
          })
      .catch((err)=>{
        return err
      })
    }

    static updateConnexion(id){
      return db.query("UPDATE users SET connexionTimestamp = NOW() WHERE id = ?", [id])
      .then((res)=>{
          return res
      })
      .catch((err)=>{
          return err
      })
    }

    static async updateValidateUser(key_id){
      let user = await db.query('UPDATE users SET validate = "yes" WHERE key_id = ?', [key_id])

        return user
    }

    static async updateKeyId(email){
        let key_id = randomId(len, pattern)
        let user = await db.query('UPDATE users SET key_id = ? WHERE email = ?', [key_id, email])
        let result = {key_id: key_id, user: user}
        return result
    }

    static async updatepassword(newPassword, key_id){
        //on crypte le nouveau password
        let hash = await bcrypt.hash(newPassword, saltRounds)

        let result = await db.query('UPDATE users SET password = ? WHERE key_id = ?', [hash, key_id])
        return result
    }

    static async getUserById(key_id){
	    let user = await db.query('SELECT * FROM users WHERE key_id = ?', [key_id])

	    return user
	}
  }
