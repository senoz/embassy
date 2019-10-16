const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

//to make it work you need gmail account
const gmailEmail = 'embassymineralwater@gmail.com'; //functions.config().gmail.login;
const gmailPassword = '$hen0zEmbassy'; // functions.config().gmail.pass;

const serviceAccount = require('./key.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//creating function for sending emails
var goMail = function (message) {

    //transporter is a way to send your emails
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        }
    });

    // setup email data with unicode symbols
    //this is how your email are going to look like
    const mailOptions = {
        from: gmailEmail, // sender address
        to: 'senozmca@gmail.com', // list of receivers
        subject: 'SHENOZ EMBASSY', // Subject line
        html: '!' + message // html body
    };

    //this is callback function to return status to firebase console
    const getDeliveryStatus = function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    };

    //call of this function send an email, and return status
    transporter.sendMail(mailOptions, getDeliveryStatus);
};

exports.forgotPassword = functions.https.onRequest((request, response) => {
    const cors = require('cors')({origin: true});

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
     console.log('request.method', request.method);
    // Check for POST request
    if (request.method !== "POST") {
        response.status(400).send('Please send a POST request');
        return;
    }
    let data = JSON.parse(request.body);
    console.log('UserName:', data.userName);
    // response.status(200).send('Please send a POST request');return;
    admin.firestore().collection('users').get()
        .then(snapshot => {
            console.log('---', snapshot);
            snapshot.forEach(doc => {
              const userData = doc.data();
              console.log('---', userData);
            //   if (userData.userName == data.userName) {
            //     console.log('---', userData.password);
            //     // goMail(userData.password);
            //   }
            });
        })
        .catch(err => {
            console.log("Error in Cloud function", err);
        });
});
