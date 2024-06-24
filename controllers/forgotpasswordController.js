const path = require('path');
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const ResetPassword = require("../models/resetPasswordModel");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

require('dotenv').config();

const getForgotPasswordPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "public", "views", "forgotpassword.html"));
}

const sendMail = async (req, res, next) => {

    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const id = uuid.v4();
            user.createResetPassword({ id, isActive: true })
                .catch((err) => {
                    throw new Error(err);
                })

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                port: 465,
                auth: {
                    user: 'sumitmajumdar16@gmail.com',
                    pass: process.env.APP_PASSWORD
                }
            });

            var mailOptions = {
                from: 'sumitmajumdar16@gmail.com',
                to: email,
                subject: 'Reset Password',
                html: ` 
                    <h2>You can reset your password by clicking the link below</h2>
                    <a href="http://localhost:3000/password/resetpassword/${id}">Reset Your Password</a>
                `
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    throw new Error(error);
                } else {
                    console.log(info.response);
                    res.status(200).json({ message: `Reset Password link sent to your email.` })
                }
            });

        }else{
            throw new Error('user does not exist');
        }
    } catch (error) {
        console.log(error.message);
        return res.status(409).json({ message: error.message });
    }

}


const resetpasswordPage = async (req,res,next) => {
    const id  = req.params.id;

    const forgotPasswordRequest = await ResetPassword.findOne({where : {id : id}});

    if(forgotPasswordRequest){
        forgotPasswordRequest.update({isActive : false});

        res.sendFile(path.join(__dirname,"../","public","views","resetpassword.html"));
    }else{
        res.status(409).json({message : "No user found"});
    }
}


const updatePassword = async (req,res,next) => {
    try {
        const {newpassword} = req.body;
        const resetpasswordid = req.params.id;

        console.log(newpassword , resetpasswordid);

        const resetPasswordRequest = await ResetPassword.findOne({where : {id : resetpasswordid}});

        if(resetPasswordRequest){
            const user = await User.findOne({where : {id : resetPasswordRequest.userId}});

            if(user){

                bcrypt.hash(newpassword , 10 , async (err , hash) => {
                    if(err){
                        throw new Error(err);
                    }
                    await User.update({password : hash} , {where : {id : user.id}}).then(() => {
                        res.status(201).json({message : 'Successfully update the new password.'});
                    })
                })

            }else{
                throw new Error("user not found");
            }
        }else{
            throw new Error("user not found");
        }
    } catch (error) {
        console.log(error);
        return res.status(409).json({message : error.message , success : false});
    }
}

module.exports = {
    getForgotPasswordPage,
    sendMail,
    resetpasswordPage,
    updatePassword
}

