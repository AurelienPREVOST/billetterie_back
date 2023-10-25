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
        refresh_token: "1//04NEGF6rH-KmJCgYIARAAGAQSNwF-L9Ir0-UpJWgRLzWBSKJMN_EFNYOPHNHxONYHCNVC8P8DCwJCv7m1SLVIet0kMQeLGv9gUh8"
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
            refreshToken: "1//04NEGF6rH-KmJCgYIARAAGAQSNwF-L9Ir0-UpJWgRLzWBSKJMN_EFNYOPHNHxONYHCNVC8P8DCwJCv7m1SLVIet0kMQeLGv9gUh8",
            //REMPLACER AUSSI https://developers.google.com/oauthplayground
            accessToken: "ya29.a0AfB_byC-Fy5DVpFx9ZGDVEp0_cLq7I64wfzhmjNc-N3Q4Csz3dGmQs5xIenSNwsscOGzGSwz94IUaiTpi-Z7qMApigQhStwe7pWf84C1eNh1NGXza1LZDnMCPMakZbMti5sC6aaLcL05jT5aVRlwWe1buoXqbcpoA6d5aCgYKAVoSARESFQGOcNnCYv_jqd779i_IELRXEGAUsA0171"
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
