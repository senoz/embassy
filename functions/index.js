const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');


//to make it work you need gmail account
const gmailEmail = 'embassymineralwater@gmail.com'; //functions.config().gmail.login;
const gmailPassword = '$hen0zEmbassy'; // functions.config().gmail.pass;

admin.initializeApp();

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
        subject: 'Hello ✔', // Subject line
        text: '!' + message, // plain text body
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

    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', '*');
    // Check for POST request
    if (request.method !== "POST") {
        response.status(400).send('Please send a POST request');
        return;
    }
    let data = request.body;
//    alert(data);
    console.log('req:', data);
    // response.status(200).send('Please send a POST request');return;
    admin.firestore().collection('users').where('userName', '==', '9659392919').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const createdData = doc;
                var text = createdData.password;

                //here we send new data using function for sending emails
                goMail(text);
            });
        })
        .catch(err => {
            console.log("Error in Cloud function", err);
        });
});
