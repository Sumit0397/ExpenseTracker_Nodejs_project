const express = require('express');
const expenseController = require("../controllers/expenseController");
const authorization = require("../middleware/auth");

const expenserouter = express.Router();


expenserouter.get("/" , expenseController.getHomePage);

expenserouter.post("/addexpense" , authorization.authenticate , expenseController.addExpense);

expenserouter.get("/allexpense" , authorization.authenticate , expenseController.getAllExpenses);

expenserouter.delete("/deleteexpense/:expenseid" , authorization.authenticate , expenseController.deleteExpense);

module.exports = expenserouter; 