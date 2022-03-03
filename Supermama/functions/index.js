const functions = require('firebase-functions');
const stripe = require('stripe')(
  'sk_test_51KWsm3FQQubomZ5Y92KULnw72kvphFduzlkj8kXrYlAXKICT4jWOiBVQ6AqPqP11U67pq9B4KqjMSsIoUBfsJhCH00JlUCIv4H',
);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.completePaymentWithStripe = functions.https.onRequest(
  (request, response) => {
    stripe.charges
      .create({
        amount: request.body.amount,
        currency: request.body.currency,
        source: request.body.token,
      })
      .then(charge => {
        response.send(charge);
      })
      .catch(error => {
        console.log(error);
        response.send({message: error.message});
      });
  },
);
