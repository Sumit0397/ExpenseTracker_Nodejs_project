const path = require('path');
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../utils/database");

const getHomePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "public", "views", "homepage.html"));
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
    deleteExpense
}
