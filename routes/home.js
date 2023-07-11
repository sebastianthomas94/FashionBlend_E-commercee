const exp = require('express');
const router = exp.Router();
const users = require("../model/user");
const product = require("../model/products");
const mongoose = require("mongoose");
const categories = require("../model/categories");



router.get("/", (req,res) => { 
    res.render("home",{loggedIn:req.session.loggedIn});
});

router.get("/orders/:orderID", (req,res)=>{
    users.aggregate([
        { $unwind: "$orders" },
        {
            $project: {
                orders: 1
            }
        },
        {
            $match: {
                "orders._id": new mongoose.Types.ObjectId(req.params.orderID)
            }
        }

    ])
        .then((result) => {
            console.log(result);
            product.find({ _id: result[0].orders.id })
                .then((result1) => {
                    res.status(200).render("ordersPage", {  loggedIn:req.session.loggedIn,orderData: result, productData: result1, userSide:true });
                })

        })
        .catch((err) => {
            console.log(err);
        })
});

router.get("/categoryfetch", (req,res)=>{
    categories.find()
        .then((result) => {
            res.status(200).json(result);
        });
});

module.exports = router;