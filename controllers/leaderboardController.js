const path = require("path");
const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const sequelize = require("../utils/database");

const leaderboardPage = (req,res,next) => {
    res.sendFile(path.join(__dirname,"../","public","views","leaderboard.html"));
}

const getPremiumLeaders = async (req,res,next) => {
    try {
        const leaderboardusers = await User.findAll({
            attributes : ["id" , "name" , [sequelize.fn('sum' , sequelize.col('amount')) , 'total_cost']] ,
            include : [
                {
                    model : Expense,
                    attributes : []
                }
            ],
            group : ["id"],
            order : [["total_cost" , "DESC"]]
        });

        res.status(200).json(leaderboardusers);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    leaderboardPage,
    getPremiumLeaders
}