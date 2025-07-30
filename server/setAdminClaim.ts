const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-service-account.json")), // 🔐 your Firebase service key
});

admin
  .auth()
  .getUserByEmail("admin1@gmail.com")
  .then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, { role: "admin" });
  })
  .then(() => {
    console.log("✅ Admin claim set!");
    process.exit();
  })
  .catch(console.error);
