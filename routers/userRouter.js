const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.use(express.static("public"));

router.get("/" , userController.getAuthenticationPage);

router.post("/signup" , userController.postUserSignup);

router.post("/login", userController.postUserLogin);

module.exports = router;