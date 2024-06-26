const Sequelize = require("sequelize");
const dotnenv = require("dotenv");

dotnenv.config();

const sequelize = new Sequelize(process.env.DB_SCHEMA , process.env.DB_USER , process.env.DB_PASSWORD , {
    dialect : 'mysql',
    host : process.env.DB_HOST
})

module.exports = sequelize;