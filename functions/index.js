const functions = require('firebase-functions');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const twilio = require('twilio');

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const accountSid = firebaseConfig.twilio.sid;
const authToken  = firebaseConfig.twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = '+12055768173' // your twilio phone number




/// start cloud function

exports.date = functions.https.onRequest((req, res) => {
    // [END trigger]
    // [START sendError]
    // Forbidding PUT requests.
    console.log('Shenoz: '+ req.query);
    if (req.method === 'GET') {
        console.log('Shenoz: '+ req.query);
    }
});   
exports.textStatus = functions.database
       .ref('/orders/{orderKey}')
       .onUpdate(event => {


    const orderKey = event.params.orderKey

    return admin.database()
                .ref(`/orders/${orderKey}`)
                .once('value')
                .then(snapshot => snapshot.val())
                .then(order => {
                    const status      = order.userId
                    const phoneNumber = 9659392919

                    if ( !validE164(phoneNumber) ) {
                        throw new Error('number must be E164 format!')
                    }

                    const textMessage = {
                        body: `Current order status: ${status}`,
                        to: phoneNumber,  // Text to this number
                        from: twilioNumber // From a valid Twilio number
                    }

                    return client.messages.create(textMessage)
                })
                .then(message => console.log(message.sid, 'success'))
                .catch(err => console.log(err))


});


/// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}