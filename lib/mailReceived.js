//on importe la librairie de nodemailer (envoi de mail)
const nodeMailer = require('nodemailer')
//on importe l'api de google
const { google } = require('googleapis')
//on récupère l'objet d'authentification du proprio du compte google à brancher
const OAuth2 = google.auth.OAuth2

module.exports = (subject, myContact, message) => {

    //on instancie l'authentification qu'on pourra utiliser dans le transport du mail
    const oauth2Client = new OAuth2(
        "594856683038-6nc6m9jk61egjgp6ln80nvfs9aa8cppu.apps.googleusercontent.com", //client_id
        "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", //client_secret
        "https://developers.google.com/oauthplayground" // Redirect URL
    )

    //envoi des authentifications clients avec le token provisoire
    oauth2Client.setCredentials({
        //REMPLACER PAR LE TOKEN TEMPORAIRE https://developers.google.com/oauthplayground
        refresh_token: "1//04vlJlGYBajt_CgYIARAAGAQSNwF-L9IrM1ctMGtvVeaPNHmekNxn3bjlwBKoI_iIP-6kojb7E7R7QrIEK1AaQuNG7mw2RfIselM"
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
            refreshToken: "1//04vlJlGYBajt_CgYIARAAGAQSNwF-L9IrM1ctMGtvVeaPNHmekNxn3bjlwBKoI_iIP-6kojb7E7R7QrIEK1AaQuNG7mw2RfIselM",
            //REMPLACER AUSSI https://developers.google.com/oauthplayground
            accessToken: "ya29.a0AfB_byAFixtrWwhwg8C7mGsp22ruiV7CZPAGTdZLuAbAEASg-jpUJ-eYd0gR4jULvqmRce1bLEeVi5tu9FiIQa4hW_w0_vzrTlrZKMm6KvUyC0vi8A7gImoY-B0yKpUDpgrlrOLaIP5i_NvmHO3MHfHnq0QW23loMcL0aCgYKAQYSARESFQGOcNnCct2uE_tsZy32r4Pmpv_YPw0171"
        }
    })

    //modèle du mail
    let mailOptions = {
        from: '"Contact-Billetterie" <contact-from-website@gmail.com>', //sender address
        to: "aurelienprevost77@gmail.com", //liste de ceux qui recoivent le mail
        subject: subject, // sujet du mail
        text: message, //on peut juste mettre un text dans le corps du mail
        html: `<h1>${subject}</h1><p>contact depuis : ${myContact}</p><p>${message}</p>` //corps html (contenu du mail) RECOMMANDE
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            return console.log(err)
        }
        console.log(`Le mail depuis le site web a bien été envoyé à aurelienprevost77@gmail.com!`, info)
    })
}
