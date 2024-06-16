const path  = require('path');
const Expense = require("../models/expenseModel");

const getHomePage = (req, res , next) => {
    res.sendFile(path.join(__dirname ,"../", "public" , "views" , "homepage.html"));
}

const addExpense = async (req,res,next) => {
    try {
        const {date , category , description , amount} = req.body;

        await Expense.create({date , category , description , amount})
        .then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            throw new Error(err);
        })
    } catch (error) {
        res.status(500).json({message : error , success : false})
    }
}

const getAllExpenses = async (req,res,next) => {
    try {
        await Expense.findAll()
        .then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            throw new Error(err);
        })
    } catch (error) {
        res.status(500).json({message : error , success : false})
    }
}

const deleteExpense = async (req,res,next) => {
    try {
        const id = req.params.expenseid;

        Expense.destroy({where : {id: id}})
        .then((noofrows) => {
            if(noofrows === 0){
                return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
            }
            return res.status(200).json({ success: true, message: "Deleted Successfuly"})
        })
    } catch (error) {
        res.status(500).json({message : error , success : false})
    }
}

const editExpense = async (req,res,next) => {
    try {
        
    } catch (error) {
        res.status(500).json({message : error , success : false})
    }
}

module.exports = {
    getHomePage,
    addExpense,
    getAllExpenses,
    deleteExpense
}