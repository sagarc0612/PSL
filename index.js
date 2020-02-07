const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')

require("dotenv").config();

const userRouter = require("./services/enter/userRoute");
const connectionRouter = require("./services/connection/connectionRoute");
const smsRouter = require("./services/sms/smsRoute");

const msgEntity = require("./services/sms/msgModel.js");
const userRepo = require("./services/sms/repo");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/uploads'));

app.use(cors({ credentials: false }));

http.listen(process.env.PORT, () => {
  console.log(`connected on this ${process.env.PORT}`);
  mongoose.connect(process.env.mongo_url);
  mongoose.Promise = global.Promise;
});

io.on('connection', socket => {
 
   socket.on('get-msg',async function(receiverId, fn) {
           fn(await userRepo.getById(receiverId));
    });
 
   socket.on('receive-msg', (userId) => {
     socket.users = { userId };
     const newUser = new msgEntity(userId);
     newUser.save();
     io.emit('establish', true);
   });
 
   socket.on('get-msg', function (receiverId) {
     io.emit('users-changed', { user: socket.nickname, event: 'left' });
   });
 
   socket.on('add-message', (message) => {
     io.emit('message', { text: message.text, from: socket.nickname, created: new Date() });
   });
 })

app.use("/router", userRouter);
app.use("/connection", connectionRouter);
app.use("/sms", smsRouter);

module.exports = app;
