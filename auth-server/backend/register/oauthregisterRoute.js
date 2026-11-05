const express = require("express");
const router = express.Router();

const { oauthregisterController } = require("./oauthregisterController")
router.post("/register", oauthregisterController);

module.exports = router;