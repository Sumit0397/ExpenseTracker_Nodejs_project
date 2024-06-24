const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ResetPassword = sequelize.define("ResetPassword" , {
    id : {
        type : Sequelize.UUID,
        allowNull : false,
        primaryKey : true
    },

    isActive : {
        type : Sequelize.BOOLEAN
    }
})

module.exports = ResetPassword;