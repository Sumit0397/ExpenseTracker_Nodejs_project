const express = require("express");
const userController = require("../controllers/userController");
const authentication = require("../middleware/auth");

const router = express.Router();

router.use(express.static("public"));

router.get("/" , userController.getAuthenticationPage);

router.get("/ispremiumuser" , authentication.authenticate ,  userController.isPremiumUser);

router.post("/signup" , userController.postUserSignup);

router.post("/login", userController.postUserLogin);

module.exports = router;