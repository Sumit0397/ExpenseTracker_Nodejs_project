const express = require('express');
const expenseController = require("../controllers/expenseController");

const expenserouter = express.Router();


expenserouter.get("/" , expenseController.getHomePage);

expenserouter.post("/addexpense" , expenseController.addExpense);

expenserouter.get("/allexpense" , expenseController.getAllExpenses);

expenserouter.delete("/deleteexpense/:expenseid" , expenseController.deleteExpense);

module.exports = expenserouter; 