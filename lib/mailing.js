//on importe la librairie de nodemailer (envoi de mail)
const nodeMailer = require('nodemailer')
//on importe l'api de google
const { google } = require('googleapis')
//on récupère l'objet d'authentification du proprio du compte google à brancher
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
        refresh_token: "1//04bMrLGYX6N-fCgYIARAAGAQSNwF-L9Ir2sLkXzzSnYlOCBYpVRpgU4utDpj-Et3slNfTg3LOMXhRAXOkoyH3dlxq67Q5IUdcGEc"
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
            refreshToken: "1//04bMrLGYX6N-fCgYIARAAGAQSNwF-L9Ir2sLkXzzSnYlOCBYpVRpgU4utDpj-Et3slNfTg3LOMXhRAXOkoyH3dlxq67Q5IUdcGEc",
            //REMPLACER AUSSI https://developers.google.com/oauthplayground
            accessToken: "ya29.a0AfB_byA0aB5vbT9F82OTZIbhKknMSKxbnoFSIczY6WVLk16vF3zvYvU1p_PpidUdUH6py2wULhCuW5eHSv9OQ92SWLRzl_liW8zZg8E1z3uVOinMugd_d1_MdcqCbpoR6eTIrSnoTEmcpZ7YJBFeLIDUyhe25c1-jEWgwwaCgYKASESARESFQGOcNnCNnknfz0dxwLew9yl7CJ7cA0173"
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
