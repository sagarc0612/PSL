const express = require("express");

const upload = require("../../middleware/picture");
const Controller = require("./controller");

const router = express.Router();

router.post("/sendOTP", Controller.sendOTP);

router.post("/verifyOTP", Controller.verifyOTP);

router.get('/listUsers', Controller.getUserslist);

router.get('/getUserById', Controller.getById);

router.delete('/deleteUserById', Controller.deleteById);

router.put('/updatePicAndUser', upload.single('profileImage'), Controller.updatePicAndUser);

module.exports = router;