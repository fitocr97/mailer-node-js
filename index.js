/*const express = require('express') */ //commonJS
import express from 'express' //Module
import path from 'path'
import ElasticEmail from '@elasticemail/elasticemail-client'
import dotenv from 'dotenv'

dotenv.config()

const apiKeyMail = process.env.API_EMAIL

const app = express()
app.use(express.json()) //interpretar los json que lleguen a la app
app.use(express.static('app'))


function esCorreoElectronicoValido(correo) {
    // Expresión regular para validar direcciones de correo electrónico
    const regexCorreoElectronico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Comprobación de la validez con la expresión regular
    const esValido = regexCorreoElectronico.test(correo);
  
    // Comprobación adicional de caracteres especiales
    const tieneCaracteresEspeciales = /[!#$%^&*()+\=\[\]{};':"\\|,<>\/?]+/.test(correo);
  
    // Retornar el resultado de las comprobaciones
    return esValido && !tieneCaracteresEspeciales;
  }
  
  

app.get('/', (req, res) => {
    res.sendFile(`${path.resolve()}/index.html`) //si no se le psaa nada a resolve devuelve el directorio actual
})


app.post('/send', (req, res) => {
    const {to, subject, description} = req.body
    console.log(to)
    console.log(subject)
    console.log(description)

    const correo = to;
    if (esCorreoElectronicoValido(correo)) {
       
        try{
            const apiKey = apiKeyMail

            const client = ElasticEmail.ApiClient.instance;

            const apikey = client.authentications['apikey'];
            apikey.apiKey = apiKey;

            const emailsApi = new ElasticEmail.EmailsApi();
            const emailData = {
                Recipients: {
                    To: [to]
                },
                Content: {
                    Body: [
                        {
                            ContentType: "HTML",
                            Charset: "utf-8",
                            Content: `<strong>${description}.<strong>`
                        },
                        {
                            ContentType: "PlainText",
                            Charset: "utf-8",
                            Content: "Mail content."
                        }
                    ],
                    From: "fitoclash17@gmail.com",
                    Subject: subject
                }
            };

            const callback = (error, data, response) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('API called successfully.');
                    console.log('Email sent.');
                }
            };


            emailsApi.emailsTransactionalPost(emailData, callback)
            res.sendStatus(204)
        }catch (e){
            console.log(e)
            res.status(400).send('error')
        }
    } else {
      console.log(`${correo} no es una dirección de correo electrónico válida.`);
    }
    
})

app.listen(3000, () => {
  console.log('app corriendo');
});

/*
app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`)  //forma commonjs
})*/