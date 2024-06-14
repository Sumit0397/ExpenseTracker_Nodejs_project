const path = require("path");
const User = require("../models/userModel");

const getAuthenticationPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "public", "views", "signuplogin.html"));
}

const postUserSignup = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            return res.status(409).json({ message: 'User already exists.' });
        } else {
            await User.create({ name, email, password });
            res.status(200).json({ message: 'User registered successfully!' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message : 'Internal Server Error!!'});
    }
}

module.exports = {
    getAuthenticationPage,
    postUserSignup
}

