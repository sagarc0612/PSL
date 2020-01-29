const express = require("express");
const router = express.Router();

const Controller = require("./controller")

router.post("/addUser", Controller.createUser);

router.post('/signin',Controller.userSignin);

router.delete('/deleteUser',Controller.deleteUser);

router.patch('/updateUser',Controller.updateUser);

router.post('/signOut',Controller.userSignOut);

router.get('/listUsers',Controller.listUsers);

module.exports = router ;
