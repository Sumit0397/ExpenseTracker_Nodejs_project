const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(id , email){
    return jwt.sign(
        {userId : id , email : email},
        "kjhsgdfiuiew889kbasgdfskjabsdfjlabsbdljhsd"
    )
}

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
            bcrypt.hash(password, 10, async (err, hash) => {
                await User.create({ name, email, password: hash });
            })
            res.status(200).json({ message: 'User registered successfully!' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error!!' });
    }
}

const postUserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result === true) {
                    res.status(200).json({ message: 'user logged in succesfully!', success: true , token: generateAccessToken(user.id , user.email) });
                } else {
                    res.status(401).json({ message: 'Password is incorrect!', success: false })
                }
                if(err){
                    throw new Error(err);
                }
            })
        } else {
            res.status(404).json({ message: 'User Not found! please login with correct credentials', success: false })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error!!', success: false });
    }
}

module.exports = {
    getAuthenticationPage,
    postUserSignup,
    postUserLogin
}

