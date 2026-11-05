const express = require("express");
const router = express.Router();

const { registercontroller } = require("./registerController")

router.post("/register", registercontroller)

module.exports = router;