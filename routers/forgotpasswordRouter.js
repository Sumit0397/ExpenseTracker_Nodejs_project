const express = require("express");
const forgotpasswordController = require("../controllers/forgotpasswordController");

const router = express.Router();

router.use(express.static("public"));

router.get("/forgotpasswordpage" , forgotpasswordController.getForgotPasswordPage);

router.post("/sendmail" , forgotpasswordController.sendMail);

router.get("/resetpassword/:id" , forgotpasswordController.resetpasswordPage);

router.put("/updatepassword/:id" , forgotpasswordController.updatePassword);

module.exports = router;