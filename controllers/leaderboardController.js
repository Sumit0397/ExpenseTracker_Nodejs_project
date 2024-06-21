const path = require("path");
const User = require("../models/userModel");
const Expense = require("../models/expenseModel");

const leaderboardPage = (req,res,next) => {
    res.sendFile(path.join(__dirname,"../","public","views","leaderboard.html"));
}

const getPremiumLeaders = async (req,res,next) => {
    try {
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {};

        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] += expense.amount;
            }else{
                userAggregatedExpenses[expense.userId] = expense.amount;
            }
        })

        const userLedaerBoardDetails = [];

        users.forEach((user) => {
            userLedaerBoardDetails.push({name : user.name , total_cost : userAggregatedExpenses[user.id] || 0});
        })

        userLedaerBoardDetails.sort((a,b) => b.total_cost - a.total_cost);

        res.status(200).json(userLedaerBoardDetails);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    leaderboardPage,
    getPremiumLeaders
}