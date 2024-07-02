const path = require("path");
const Expense = require("../models/expenseModel");
const {Op} = require("sequelize");

const getReportPage = (req,res,next) => {
    res.sendFile(path.join(__dirname,"../","public","views","reports.html"));
}

const getDailyExpense = async (req,res,next) => {
    try {
        const date = req.body.date;

        const result = await Expense.findAll({
            where : { date : date , userId : req.user.id}
        })

        if(result){
            res.status(201).json(result);
        }else{
            res.status(404).json({message : 'No data found' , success : false})
        }
    } catch (error) {
        res.status(409).json({message : error.message , success : false})
    }
}

const getMonthlyExpense = async (req,res) => {
    try {
        const month = req.body.month;

        const expenses = await Expense.findAll({
            where : {
                date : {
                    [Op.like] : `%-${month}-%`
                },
                userId : req.user.id
            },
            raw : true
        })

        if(expenses){
            res.status(201).json(expenses);
        }else{
            res.status(404).json({message : "No record found" , success : false})
        }

    } catch (error) {
        res.status(409).json({message : error.message , success : false});   
    }
}

const getYearlyExpense = async (req,res) => {
    try {
        const year = req.body.year;

        const expenses = await Expense.findAll({
            where : {
                date : {
                    [Op.like] : `${year}-%-%`
                },
                userId : req.user.id
            },
            raw : true
        })

        if(expenses){
            res.status(201).json(expenses);
        }else{
            res.status(404).json({message : "No record found" , success : false})
        }

    } catch (error) {
        res.status(409).json({message : error.message , success : false});   
    }
}

module.exports = {
    getReportPage,
    getDailyExpense,
    getMonthlyExpense,
    getYearlyExpense
}