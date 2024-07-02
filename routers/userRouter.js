const express = require("express");
const userController = require("../controllers/userController");
const authentication = require("../middleware/auth");
const expenseController = require("../controllers/expenseController");

const router = express.Router();

router.use(express.static("public"));

router.get("/" , userController.getAuthenticationPage);

router.get("/ispremiumuser" , authentication.authenticate ,  userController.isPremiumUser);

router.get("/download" , authentication.authenticate , expenseController.downloadExpenses);

router.post("/signup" , userController.postUserSignup);

router.post("/login", userController.postUserLogin);

module.exports = router;