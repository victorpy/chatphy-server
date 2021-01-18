//https://github.com/betiol/firebase-auth-devto/blob/master/server/index.js

const { enviroment, serverPort } = require('./config/config');
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const authMiddleware = require("./auth-middleware");
var admin = require('firebase-admin');
var db=admin.database();
var messaging = admin.messaging();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/", authMiddleware);

app.get("/contact/search/:email", (req, res) => {

    const email = req.params.email;
    let message="";
    let status=200;
  console.log("Param received "+email);
  
  admin
  .auth()
  .getUserByEmail(email)
  .then((userRecord) => {
    let response = {};
    // See the UserRecord reference doc for the contents of userRecord.
    record = JSON.stringify(userRecord)
    console.log(`User found! ${record}`);
    response.message="User found";
    response.uid = userRecord.uid;
    response.status=200
    return response;
  })
  .catch((error) => {
    let response = {};
    console.log('User not found!');
    response.message="User not found";
    response.status=404;
    response.uid = '';
    return response;
    //res.status(404).send({ message: "User not found" });
  }).then((response) => {

      res.status(response.status).send({ message: response.message, uid: response.uid  });
  });

});

/**TODO get notification token for push notifications */
app.post("/message", (req, res) => {

    console.log(req.body);
    const token = null; 
    

    /**add message in DB */
    var ref = db.ref("chats").child(req.body.chat_id).push(
      {
          content: req.body.content,
          destination_uid: req.body.destination_uid,
          origin_uid: req.body.origin_uid,
          timestamp: Date.now()
      }   
    );

    /**get user profile data for push notifications id */
    var profile =  db.ref(`profile`).child(req.body.destination_uid).once("value", snapshot => {
        snapshot.forEach((snap) => {
            const token = snap.val();

            var message = {
                notification: {
                    title: "Title",
                    body: "Body"
                  },
                token: token
              };

            message.token = token;

            console.log("Token "+message.token)

            /**send push */
            messaging.sendToDevice(token, message)
            .then((response) => {
                console.log("Message sent");
            })
            .catch((error) => {
                console.log(error);
            });
        });
    });    

    res.status(200).send({ message: "message created" });
});


app.listen(serverPort, () => console.log(`The server is running at PORT ${serverPort}`));