const express = require("express");
const purchaseMembershipController = require("../controllers/purchaseMembershipController");
const authentication = require("../middleware/auth");

const router = express.Router();

router.get("/premiummembership" , authentication.authenticate, purchaseMembershipController.purchasepremium);

router.post("/updatetransactionstatus" , authentication.authenticate , purchaseMembershipController.updateTransactionStatus);

module.exports = router;