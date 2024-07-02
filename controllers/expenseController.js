const path = require('path');
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../utils/database");
const AWS = require("aws-sdk");

require("dotenv").config();

const getHomePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "public", "views", "homepage.html"));
}

function uploadToS3(data , fileName){
    const BUCKET_NAME = process.env.S3_BUCKET_NAME;
    const IAM_USER_ID = process.env.IAM_USER_KEY_ID;
    const IAM_USER_SECRET_KEY = process.env.IAM_USER_SECRET_KEY;

    const s3Bucket = new AWS.S3({
        accessKeyId : IAM_USER_ID,
        secretAccessKey : IAM_USER_SECRET_KEY
    });

    const params = {
        Bucket : BUCKET_NAME,
        Key : fileName,
        Body : data,
        ACL : 'public-read'
    }

    return new Promise((resolve , reject) => {
        s3Bucket.upload(params , (err , s3response) => {
            if(err){
                console.log("something went wrong", err);
                reject(err);
            }else{
                resolve(s3response.Location);
            }
        })
    })
}

const downloadExpenses = async (req,res) => {
    try {
        const expenses = await req.user.getExpenses();
        const stringifyExpenseData = JSON.stringify(expenses);
    
        const userId = req.user.id;
    
        const fileName = `Expenses${userId}/${new Date()}.txt`;
        const fileurl = await uploadToS3(stringifyExpenseData , fileName);
    
        res.status(200).json({fileurl , success : true});
    } catch (error) {
        res.status(500).json({fileurl : "" , success : false , message : error.message});
    }
}

const addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { date, category, description, amount } = req.body;

        const newExpense = await Expense.create(
            { date, category, description, amount, userId: req.user.id },
            { transaction: t }
        );

        const totalExpense = Number(req.user.totalExpense) + Number(amount);

        await User.update(
            { totalExpense: totalExpense },
            { where: { id: req.user.id }, transaction: t }
        );

        await t.commit();
        res.status(200).json(newExpense);
    } catch (error) {
        await t.rollback();
        console.error('Error adding expense:', error);
        res.status(500).json({ message: error.message || 'Internal server error', success: false });
    }
}

const getAllExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: error.message || 'Internal server error', success: false });
    }
}

const deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.expenseid;
        const expense = await Expense.findOne({ where: { id: id } });

        if (!expense || expense.userId !== req.user.id) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Expense does not belong to the user' });
        }

        const totalExpense = Number(req.user.totalExpense) - Number(expense.amount);

        await Expense.destroy({ where: { id: id, userId: req.user.id }, transaction: t });

        await User.update(
            { totalExpense: totalExpense },
            { where: { id: req.user.id }, transaction: t }
        );

        await t.commit();
        res.status(200).json({ success: true, message: "Deleted Successfully" });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: error.message || 'Internal server error', success: false });
    }
}

module.exports = {
    getHomePage,
    addExpense,
    getAllExpenses,
    deleteExpense,
    downloadExpenses
}
