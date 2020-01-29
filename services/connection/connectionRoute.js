const express = require("express");
const router = express.Router();

const Controller = require("./controller")

router.post("/addConnection", Controller.addConnection);

module.exports = router ;
