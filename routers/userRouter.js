const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.use(express.static("public"));

router.get("/" , userController.getAuthenticationPage);

router.post("/signup" , userController.postUserSignup);

module.exports = router;