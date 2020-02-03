const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')

require("dotenv").config();

const userRouter = require("./services/enter/userRoute");
const connectionRouter = require("./services/connection/connectionRoute");
const smsRouter = require("./services/sms/smsRoute");

const app = express();

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/uploads'));

app.listen(process.env.PORT, () => {
  console.log(`connected on this ${process.env.PORT}`);
  mongoose.connect(process.env.mongo_url);
  mongoose.Promise = global.Promise;
});

app.use("/router", userRouter);
app.use("/connection", connectionRouter);
app.use("/sms", smsRouter);

module.exports = app;
