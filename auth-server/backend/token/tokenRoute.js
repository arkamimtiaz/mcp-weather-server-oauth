const express = require("express");
const router = express.Router();


const { tokenController } = require("./tokenController")

router.post("/token", tokenController)



module.exports = router;