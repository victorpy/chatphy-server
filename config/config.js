const result = require('dotenv').config();

if (result.error) {
  throw result.error
}
 
if(process.env.NODE_ENV=="development")
    console.log(result.parsed)

module.exports = {
  enviroment: process.env.NODE_ENV,
  firebaseProject: process.env.FIREBASE_PROJECT,
  serverPort: process.env.PORT
};