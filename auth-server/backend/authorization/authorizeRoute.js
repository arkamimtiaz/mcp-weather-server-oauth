const express = require("express");
const router = express.Router();

const { authorizationController } = require("./authorizationController")
router.get("/authorize", authorizationController);

module.exports = router;