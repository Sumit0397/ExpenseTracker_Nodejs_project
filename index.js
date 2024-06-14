const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./utils/database");
const dotnenv = require("dotenv");

dotnenv.config();

const app = express();

const userRouter = require("./routers/userRouter");

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cors());

app.use("/" , userRouter);

app.use("/user" , userRouter);

sequelize.sync()
.then(() => {
    app.listen(process.env.PORT || 3000 , () => {console.log("Server is started in 3000 port.")})
})
.catch((err) => {
    console.error(err);
})

