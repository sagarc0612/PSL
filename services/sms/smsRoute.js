const express = require("express");
const router = express.Router();

const Controller = require("./controller");

router.post("/sendOTP", Controller.sendOTP);

router.post("/verifyOTP", Controller.verifyOTP);


module.exports = router ;