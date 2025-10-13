const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const apps = {}; // Map of database URLs to Firebase apps

function getDatabaseRef(databaseURL, path) {
  const app = getFirebaseApp(databaseURL);
  return app.database().ref(path);
}

function getFirebaseApp(databaseURL) {
  if (apps[databaseURL]) {
    return apps[databaseURL];
  }
  console.log(databaseURL);
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
  }, databaseURL); // second argument is the app name (unique)

  apps[databaseURL] = app;
  return app;
}


module.exports = { getFirebaseApp, getDatabaseRef }