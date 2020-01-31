const express = require("express");
const upload = require("../../middleware/picture");

const router = express.Router();

const Controller = require("./controller");

router.post("/sendOTP", Controller.sendOTP);

router.post("/verifyOTP", Controller.verifyOTP);

router.get('/listUsers', Controller.getUserslist);

router.get('/getUserById', Controller.getById);

router.delete('/deleteUserById', Controller.deleteById);

router.put('/uploadPic', upload.single('profileImage'), Controller.uploadPic);

module.exports = router;