const express = require("express");
const upload = require("../../middleware/picture");

const router = express.Router();

const Controller = require("./controller");

router.post("/sendOTP", Controller.sendOTP);

router.post("/verifyOTP", Controller.verifyOTP);

router.get('/listUsers', Controller.getUserslist);

router.get('/getUserById/:id', Controller.getById);

router.post('/receiverAndSenderIds', Controller.receiverAndSenderIds);

router.delete('/deleteUserById', Controller.deleteById);

router.put('/uploadPic', upload.single('profileImage'), Controller.uploadPic);

router.put('/updateStatusByMsgId', Controller.updateStatusByMsgId);

router.put('/multipleUpdateMessages', Controller.multipleUpdateMessages);

router.delete('/deleteMessage', Controller.deleteMessage);

router.post('/getConnectedUser', Controller.getConnectedUser);

module.exports = router;