const express = require("express");
const leaderboardController = require("../controllers/leaderboardController");

const router = express.Router();

router.use(express.static("public"));

router.get("/getleaderboardpage" , leaderboardController.leaderboardPage);

router.get("/getpremiumleaders" , leaderboardController.getPremiumLeaders);

module.exports = router;