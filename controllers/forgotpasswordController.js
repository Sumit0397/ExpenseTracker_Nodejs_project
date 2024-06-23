const path = require('path');
const nodemailer = require("nodemailer");

require('dotenv').config();

// console.log(process.env.RESETPASSWORD_API_KEY);

const getForgotPasswordPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "public", "views", "forgotpassword.html"));
}

const sendMail = async (req, res, next) => {

    try {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            secure : true,
            port : 465,
            auth: {
                user: 'sumitmajumdar16@gmail.com',
                pass: process.env.APP_PASSWORD
            }
        });

        var mailOptions = {
            from: 'sumitmajumdar16@gmail.com',
            to: req.body.email,
            subject: 'Reset Password',
            html: ` 
                <h1>Reset Your Password By clicking The below link</h1>
                <a>Click me</a>
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw new Error(error);
            } else {
                console.log(info.response);
                res.status(200).json({message: `Reset Password link sent to your email.`})
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.status(409).json({ message: "failed changing password" });
    }

}

module.exports = {
    getForgotPasswordPage,
    sendMail
}

