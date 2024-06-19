const Razorpay = require('razorpay');
const Order = require("../models/ordersModel");
const userController = require("../controllers/userController");


const purchasepremium = async (req,res) => {
    try {
        const rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const amount = 30000;

        rzp.orders.create({amount , currency : 'INR'} , (err , order) => {
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id , status : 'PENDING'}).then(() => {
                return res.status(201).json({order , key_id : rzp.key_id})
            }).catch((err) => {
                throw new Error(err);
            })
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

const updateTransactionStatus = async (req,res) => {
    try {
        const userId = req.user.id;
        const {payment_id , order_id} = req.body;
        console.log(order_id , payment_id);
        const order = await Order.findOne({where : {orderid : order_id}});
        const promise1 = order.update({paymentid : payment_id , status : 'SUCCESSFUL'});
        const promise2 = req.user.update({ isPremiumUser : true });

        Promise.all([promise1 , promise2])
        .then(() => {
            return res.status(202).json({
                success : true,
                message : "Transaction Successful",
                token : userController.generateAccessToken(userId,undefined,true)
            });
        })
        .catch((error) => {
            throw new Error(error);
        })
    } catch (error) {
        console.log(error);
        res.status(403).json({ error: error, message: 'Something went wrong' , status : "FAILED" });
    }
}


module.exports = {
    purchasepremium,
    updateTransactionStatus
}