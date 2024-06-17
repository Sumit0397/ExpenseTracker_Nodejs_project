const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticate = (req,res,next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(
            token,
            "kjhsgdfiuiew889kbasgdfskjabsdfjlabsbdljhsd"
        )
        User.findByPk(user.userId).then((user) => {
            req.user = user;
            next();
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({success : false , message : error});
    }
}

module.exports = {
    authenticate
}