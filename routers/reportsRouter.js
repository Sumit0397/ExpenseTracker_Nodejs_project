const express = require("express");
const reportsController = require("../controllers/reportsController");
const authentication = require("../middleware/auth");

const router = express.Router();

router.use(express.static("public"));

router.get("/getreportpage" , reportsController.getReportPage);

router.post("/getdailyexpense" , authentication.authenticate ,  reportsController.getDailyExpense);

router.post("/getmonthlyexpense" , authentication.authenticate , reportsController.getMonthlyExpense);

router.post("/getyearlyexpense" , authentication.authenticate , reportsController.getYearlyExpense);

module.exports = router;