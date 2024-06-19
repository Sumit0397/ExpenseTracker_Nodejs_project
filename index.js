const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./utils/database");
const dotnenv = require("dotenv");
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/ordersModel");

dotnenv.config();

const app = express();

const userRouter = require("./routers/userRouter");
const expenseRouter = require("./routers/expenseRouter");
const purchasMembershipeRouter = require("./routers/purchaseMembershipRouter");

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cors());

app.use("/" , userRouter);

app.use("/user" , userRouter);

app.use("/homepage" , expenseRouter);

app.use("/expense" , expenseRouter);

app.use("/purchase" , purchasMembershipeRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(process.env.PORT || 3000 , () => {console.log("Server is started in 3000 port.")})
})
.catch((err) => {
    console.error(err);
})

