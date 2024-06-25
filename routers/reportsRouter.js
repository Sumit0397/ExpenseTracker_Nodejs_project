const express = require("express");
const reportsController = require("../controllers/reportsController");

const router = express.Router();

router.use(express.static("public"));

router.get("/getreportpage" , reportsController.getReportPage);

module.exports = router;