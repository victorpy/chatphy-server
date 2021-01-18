/*
    auth-middleware.js
*/
const { enviroment } = require('./config/config');
const firebase = require("./firebase/index");

function authMiddleware(request, response, next) {
  const headerToken = request.headers.authorization;
  console.log(`--${headerToken}--`);
  if (!headerToken) {
    return response.status(401).send({ message: "No token provided" });
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    response.status(401).send({ message: "Invalid token" });
  }

  const token = headerToken.split(" ")[1];
  firebase
    .auth()
    .verifyIdToken(token)
    .then(() => next())
    .catch(() => response.status(403).send({ message: "Could not authorize" }));
}

module.exports = authMiddleware;
