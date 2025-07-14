const admin = require("firebase-admin");
const serviceAccount = require("../firebase-service-account.json"); // Place your JSON here

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
