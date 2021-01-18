const { enviroment, firebaseProject } = require('./../config/config');
const firebase = require("firebase-admin");
const result = require('dotenv').config();

const credentials = require("./credentials.json");

firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
  databaseURL: `https://${firebaseProject}.firebaseio.com`,
});

module.exports = firebase;