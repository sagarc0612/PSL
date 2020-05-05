const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')

const firebase = require("firebase-admin");

const serviceAccount = require('./secret.json');

const notification = require('././middleware/notification')

require("dotenv").config();

const controller = require("./services/sms/controller");

const userRouter = require("./services/enter/userRoute");
const connectionRouter = require("./services/connection/connectionRoute");
const smsRouter = require("./services/sms/smsRoute");

const msgRepo = require("./services/sms/msg/msgRepo");
const repo = require("./services/sms/repo");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/uploads'));

app.listen(process.env.PORT, () => {
  console.log(`connected on this ${process.env.PORT}`);
  mongoose.connect(process.env.mongo_url);
  mongoose.Promise = global.Promise;
});

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "mongodb://localhost:27017/admin"
});

// let message = {
//   token: "c43NeHcgxrI:APA91bFi_bM95Ca3FS3TCYE8uaUrXDvjnjdmr7OwnqNXxM0baf7sZ83k8N9LWypeuX2HGq6BIHLXWNFC2jEUAlylX6bdoLS9TUGv24PWxHIXIT4jmgzFT6rgrqgjyFkF_ZzN873krwcQ",
//   android: {
//     priority: "high",
//     notification: {
//       title: "sender.fullname" ,
//       body: "lastMessage.message",
//       image: "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
//     }
//   }
// };

// firebase.messaging().send(message).then(function (response) {
//   console.log(response);
// })


const conversation = [];
io.on('connection', async socket => {

  socket.on('send-msg', async (userId) => {

    let messagesOfBothUsers;
    if (userId.phoneNumber !== undefined) {
      //messagesOfBothUsers = await msgRepo.getByReceiverAndSenderIds(userId);
      conversation.push(messagesOfBothUsers);
      io.emit('get-msg', messagesOfBothUsers)
    }
    else {
      let lastMessageAndNumber = []
      const date = new Date(userId.createdAt);
      const milliseconds = date.getTime();
      userId.createdAt = milliseconds;
      await msgRepo.addMessage(userId);
      let lastMessage = await msgRepo.getLastId(userId.senderId)
      let sender = await repo.getUserById(userId.senderId)
      lastMessageAndNumber.push(lastMessage, sender.Mobile, sender.profileImage);
      conversation;
      conversation.push(lastMessage, userId);
      io.emit('chatt-msg', lastMessageAndNumber);
      let receiver = await repo.getUserById(userId.receiverId)
      let firebaseToken = receiver.token;
      let message;
      if (receiver.platform == "android") {
        message = {
          token: firebaseToken,
          android: {
            priority: "high",
            notification: {
              title: sender.fullname,
              body: lastMessage.message,
              image: "http://192.168.0.28:8511/"+ sender.profileImage
              // image: "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
            }
          }
        };
      } else {
        message = {
          token: firebaseToken,
          notification: {
            title: sender.fullname,
            body: lastMessage.message,
          },
          apns: {
            payload: {
              aps: {
                "mutable-content": 1
              }
            },
            fcm_options: {
              image: "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
            }
          }
        }
      }
      const options = {
        priority: 'high',
      };

      firebase.messaging().send(message).then(function (response) {
        console.log(response);
      })
    }
    //notification(sender ,lastMessage, firebaseToken);
    
  }),
    socket.on('disable-msg', async (userId) => {
      const changeMultiple = await Promise.all(
        userId.map(async msg => {
          let status;
          if (msg.isEveryOne) {
            status = {
              receiverStatus: true,
              senderStatus: true
            }
          } else {
            if (msg.receiverId !== "") {
              status = {
                receiverStatus: true
              }
            }
            if (msg.senderId !== "") {
              status = {
                senderStatus: true
              }
            }
          }
          return await msgRepo.updateStatusByMsgId(msg.messageId, status);
        })
      );
      io.emit('delete-msg', changeMultiple);
    }),
    socket.on('connected', async(userId) => {
      let ff = [];
      let receiver= await repo.getUserById(userId.receiverId);
      ff.push(receiver.senderId);



    })

    
    
});



//setTimeout(controller.deleteMessage, 100000000000);

app.use("/router", userRouter);
app.use("/connection", connectionRouter);
app.use("/sms", smsRouter);

module.exports = app;
