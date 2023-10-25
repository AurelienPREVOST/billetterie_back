const nodeMailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2


module.exports = (mailTo, subject, title, text) => {

    //on instancie l'authentification qu'on pourra utiliser dans le transport du mail
    const oauth2Client = new OAuth2(
        "594856683038-6nc6m9jk61egjgp6ln80nvfs9aa8cppu.apps.googleusercontent.com", //client_id
        "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", //client_secret
        "https://developers.google.com/oauthplayground" // Redirect URL
    )

    //envoi des authentifications clients avec le token provisoire
    oauth2Client.setCredentials({
        //REMPLACER PAR LE TOKEN TEMPORAIRE https://developers.google.com/oauthplayground
        refresh_token: "1//04oJ1ZnBP3cIxCgYIARAAGAQSNwF-L9Ira6FpEONMS-65F5T17pClpH_9f3VDbDS0Eic48kjfBrxab18YxABgnr9P6yxUGmT6dgY"
    })

    //création du transport du mail pret à partir (préparation)
    let transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'aurelienprevost77@gmail.com',
            clientId: "594856683038-6nc6m9jk61egjgp6ln80nvfs9aa8cppu.apps.googleusercontent.com",
            clientSecret: "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",
            //REMPLACER PAR LE TOKEN TEMPORAIRE https://developers.google.com/oauthplayground
            refreshToken: "1//04oJ1ZnBP3cIxCgYIARAAGAQSNwF-L9Ira6FpEONMS-65F5T17pClpH_9f3VDbDS0Eic48kjfBrxab18YxABgnr9P6yxUGmT6dgY",
            //REMPLACER AUSSI https://developers.google.com/oauthplayground
            accessToken: "ya29.a0AfB_byBWwY4YQY7T2l36xiQvygW9N_26qDwOlh5nvjHUmhdqFrwbmSzFZYbqy88RF30tu4_pQNv7MEHI3x24wgesFdMt6qyx0ExEy3JDYqeqzhp6hL3AoziQ95fR1XpvguKh8uvRA1SWq-mFXw4sVKwWsrLYaPXSovm6aCgYKAY4SARESFQGOcNnCduObBALRjL2PNjkEyhbyCQ0171"
        }
    })

    //modèle du mail
    let mailOptions = {
        from: '"Billetterie-React" <noreply-billeterie@gmail.com>', //sender address
        to: mailTo, //liste de ceux qui recoivent le mail
        subject: subject, // sujet du mail
        text: "", //on peut juste mettre un text dans le corps du mail
        html: `<h1>${title}</h1><p>${text}</p>` //corps html (contenu du mail) RECOMMANDE
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            return console.log(err)
        }
        console.log(`Le mail a bien été envoyé à ${mailTo}!`, info)
    })
}
