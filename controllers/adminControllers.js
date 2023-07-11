const product = require("../model/products");
const users = require("../model/user");
const category = require('../model/categories');
const refferals = require("../model/referrals");
const { validateLoggin,
    userLoggin,
    pageNation } = require("../middleware/general");
const mongoose = require("mongoose");
const Offers = require("../model/offers");

const adminUsername = "admin";
const adminPassword = "pass";



const loginGet = (req, res) => {
    if (req.session.adminLoggedIn)
        res.redirect("/admin");
    else {
        res.render("adminLogin", { layout: false });
    }
};

const loginPost = (req, res) => {
    if (req.body.username === adminUsername && req.body.password === adminPassword) {
        req.session.adminLoggedIn = true;
        res.redirect("/admin");
    }
    else {
        res.redirect("/admin/login");
        console.log("invalid credentials");
    }
};

const productsGet = async (req, res) => {
    let pageNo;
    if (req.query.p)
        pageNo = req.query.p;
    else
        pageNo = 1;
    const capacity = 10;
    const aggrigateStages = [];
    const [productForPage, totalCount] = await pageNation(pageNo, capacity, aggrigateStages, product);
    const totalPages = Math.floor(parseInt(totalCount[0].count) / capacity) + 1;

    res.render("adminProducts", { layout: "adminLayout", products: productForPage, totalPages, pageNo, count: totalCount[0].count, capacity });

};

const logoutGet = (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
};

const addproductsGet = (req, res) => {
    res.render("addProducts", { layout: "adminLayout" });
};

const addproductsPost = (req, res) => {
    console.log(req.body);
    const newProduct = new product({
        name: req.body.name,
        price: req.body.price,
        categories: req.body.categories,
        img: [req.files[0].originalname, req.files[1].originalname, req.files[2].originalname, req.files[3].originalname],
        moreInfo: {
            brand: req.body.brand,
            description: req.body.description,
            discount: req.body.discount
        }
    });

    newProduct.save()
        .then((result) => {
            res.redirect("/admin/products")
        })
        .catch((err) => {
            console.log('error at adding products:', err);
            res.send("error");
        });
};

const usersGet = (req, res) => {
    users.find()
        .then((data) => {
            res.render("usersList", { layout: "adminLayout", users: data });
        })
        .catch((err) => { console.log("error in user display", err) });

};

const blockUser = (req, res) => {
    users.find({ _id: req.params.id })
        .then((data) => {
            if (data[0].ban) {
                const update = {
                    ban: false
                }
                users.updateOne({ _id: req.params.id }, update)
                    .then()
                    .catch((err) => {
                        console.log("not updated ban", err);
                    });
            }
            else {
                const update = {
                    ban: true
                }
                users.updateOne({ _id: req.params.id }, update)
                    .then()
                    .catch((err) => {
                        console.log("not updated ban", err);
                    });
            }
        })
        .catch((err) => { console.log("error from blockuser", err) });
    res.redirect("/admin/users");
};


const editProductsGet = (req, res) => {

    product.find({ _id: req.params.id })
        .then((data) => {
            res.render("adminEditProduct", { layout: "adminLayout", product: data[0] });
        });

};

const editProductsPost = (req, res) => {

    product.updateOne({ _id: req.params.id }, req.body)
        .then((data) => {
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log("error at update products", err)
        });

};

const deleteProductsGet = (req, res) => {
    product.deleteOne({ _id: req.params.id })
        .then((result) => {
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

const ordersGet = async (req, res) => {
    let pageNo;
    if (req.query.p)
        pageNo = req.query.p;
    else
        pageNo = 1;
    const capacity = 10;
    const aggrigateStages = [
        { $unwind: "$orders" }, {
            $project: {
                "productId": "$orders.id", "name": "$name", "numbers": "$orders.numbers", "oderId": "$orders._id",
                "amount": "$orders.amount", "status": "$orders.status", "phone": "$phone",
                "address": "$address", "userId": "$_id"
            }
        }
    ];
    const [data, totalCount] = await pageNation(pageNo, capacity, aggrigateStages, users);
    const totalPages = Math.floor(parseInt(totalCount[0].count) / capacity) + 1;
    res.render("orderList", { layout: "adminLayout", users: data, totalPages, pageNo, count: totalCount[0].count, capacity });


};

const deliveredGet = (req, res) => {
    users.findOneAndUpdate(
        { "orders._id": req.params.id },
        { $set: { "orders.$.status": "delivered" } })
        .then(() => {
            res.redirect(req.get('referer'));
        });
};

const cancelGet = (req, res) => {
    users.findOneAndUpdate(
        { "orders._id": req.params.id },
        { $set: { "orders.$.status": "cancel" } })
        .then(() => {
            res.redirect(req.get('referer'));
        });
}





const salesReport = async (req, res) => {
    let data;
    switch (req.params.period) {
        case "daily":
            data = await getDailySalesReport(dateAndTime(new Date()));
            break;
        case "weekly":
            data = await getWeeklySalesReport();
            break;
        case "monthly":
            data = await getMonthlySalesReport();
            break;
        case "custom":
            console.log("custom");
            break;
    }
    res.status(200).json({ data });
};

function getDailySalesReport(currentDate) {
    return new Promise((resolve, reject) => {
        users.aggregate([
            { $match: { "orders.date": currentDate } },
            { $project: { orders: { $filter: { input: "$orders", as: "order", cond: { $eq: ["$$order.date", currentDate] } } }, _id: 0 } },
            { $project: { orders: 1, _id: 0 } },
            { $unwind: "$orders" },
            { $replaceRoot: { newRoot: "$orders" } }
        ])
            .then((result) => {
                const dailySales = {
                    count: result.length,
                    amount: 0,
                    average: 0
                };
                let sum = 0;
                for (let i in result)
                    if (result[i].amount)
                        sum += parseInt(result[i].amount);
                dailySales.amount = sum;
                dailySales.average = Math.floor(dailySales.amount / dailySales.count);

                resolve(dailySales); // Resolve the promise with the result
            })
            .catch((error) => {
                reject(error); // Reject the promise with the error
            });
    });
}

function getWeeklySalesReport() {
    const currentDate = dateAndTime(new Date());
    const lastWeekDate = dateAndTime(new Date() - 7 * 24 * 60 * 60 * 1000);
    return new Promise((resolve, reject) => {
        users.aggregate([
            { $match: { "orders.date": { $lte: currentDate }, "orders.date": { $gt: lastWeekDate } } },
            { $project: { orders: { $filter: { input: "$orders", as: "order", cond: { $eq: ["$$order.date", "20-6-2023"] } } }, _id: 0 } },
            { $project: { orders: 1, _id: 0 } },
            { $unwind: "$orders" },
            { $replaceRoot: { newRoot: "$orders" } }
        ])
            .then((result) => {
                const weeklySales = {
                    count: result.length,
                    amount: 0,
                    average: 0
                };
                let sum = 0;
                for (let i in result)
                    if (result[i].amount)
                        sum += parseInt(result[i].amount);
                weeklySales.amount = sum;
                weeklySales.average = Math.floor(weeklySales.amount / weeklySales.count);

                resolve(weeklySales); // Resolve the promise with the result
            })
            .catch((error) => {
                reject(error); // Reject the promise with the error
            });
    });

}

function getMonthlySalesReport() {
    const currentDate = dateAndTime(new Date());
    const lastMonthDate = dateAndTime(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
    return new Promise((resolve, reject) => {
        users.aggregate([
            { $match: { "orders.date": { $lte: currentDate }, "orders.date": { $gt: lastMonthDate } } },
            { $project: { orders: { $filter: { input: "$orders", as: "order", cond: { $eq: ["$$order.date", "20-6-2023"] } } }, _id: 0 } },
            { $project: { orders: 1, _id: 0 } },
            { $unwind: "$orders" },
            { $replaceRoot: { newRoot: "$orders" } }
        ])
            .then((result) => {
                const monthlySales = {
                    count: result.length,
                    amount: 0,
                    average: 0
                };
                let sum = 0;
                for (let i in result)
                    if (result[i].amount)
                        sum += parseInt(result[i].amount);
                monthlySales.amount = sum;
                monthlySales.average = Math.floor(monthlySales.amount / monthlySales.count);

                resolve(monthlySales); // Resolve the promise with the result
            })
            .catch((error) => {
                reject(error); // Reject the promise with the error
            });
    });

}

function dateAndTime(date_) {

    const currentDate = new Date(date_); // Convert the timestamp to a Date object

    // Extract date components
    const day = currentDate.getDate(); // Get the day of the month
    const month = currentDate.getMonth() + 1; // Get the month (months are zero-based, so adding 1)
    const year = currentDate.getFullYear(); // Get the four-digit year



    const date = `${day}-${month}-${year}`;
    return date;
}

const chartDataGet = async (req, res) => {
    let totalSales = [];
    for (let i = 0; i < 5; i++)
        totalSales.push(await getDailySalesReport(dateAndTime(new Date() - (i) * 24 * 60 * 60 * 1000)));
    let salesAmount = [];
    for (let i = 0; i < 5; i++)
        salesAmount.push(totalSales[i].amount);
    res.status(200).json({ salesAmount });
};

const adminHome = async (req, res) => {
    const pastFiveOrders = await users.aggregate([
        { $unwind: "$orders" }, /* Flatten the array field*/
        { $sort: { "orders.date": -1 } }, /* Sort by the 'date' field in descending order*/
        { $limit: 5 } /* Get the top 5 documents*/,
        { $project: { orders: 1, _id: 0, name: 1 } }
    ])
    res.status(200).render("adminHome", { layout: "adminLayout", pastFiveOrders });

};
const categoriesGet = (req, res) => {
    category.find({})
        .populate('children')
        .exec()
        .then((result) => {
            console.log(result);
            res.render('adminCategories', { layout: "adminLayout", categories: result });
        });
};

const orderDetailsGet = (req, res) => {
    users.aggregate([
        { $unwind: "$orders" },
        {
            $project: {
                orders: 1
            }
        },
        {
            $match: {
                "orders._id": new mongoose.Types.ObjectId(req.params.orderId)
            }
        }

    ])
        .then((result) => {
            console.log(result);
            product.find({ _id: result[0].orders.id })
                .then((result1) => {
                    res.status(200).render("ordersPage", { layout: "adminLayout", orderData: result, productData: result1, userSide:false });
                })

        })
        .catch((err) => {
            console.log(err);
        })
};

const refundApprovals = (req, res) => {
    users.aggregate([
        { $unwind: "$orders" },
        {
            $project: {
                orders: 1
            }
        },
        {
            $match: {
                "orders.status": "cancel"
            }
        }

    ])
        .then((result) => {
            res.status(200).render("refund-approvals", { layout: "adminLayout", orderData: result });
        });
};

const InitiateRefundGet = async (req, res) => {
    const order = await users.findOne(
        { "orders._id": req.params.orderID },
        { "orders.$": 1 }
    );

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    const x = order.orders[0].amount;
    users.findOneAndUpdate(
        { "orders._id": req.params.orderID },
        { $inc: { wallet: parseInt(x) } },
        { new: true }
    )
        .then((result) => {
            users.findOneAndUpdate(
                { "orders._id": req.params.orderID },
                { $pull: { orders: { _id: req.params.orderID } } },
                { new: true }
            )
                .then(() => {
                    console.log(req.get('referer'));
                    if (!req.get('referer') === "/admin/refund-approvals")
                        res.status(200).redirect("/admin");
                    else
                        res.status(200).redirect("/admin");
                });
        });
};

const categorySearchGet = (req, res) => {
    category.find({})
        .then((result) => {
            res.status(200).json(result);
        });

};

const couponsGet = (req, res) => {
    Offers.find()
        .then((data) => {
            console.log(data);
            res.status(200).render("admin-coupons", { layout: "adminLayout", offers: data });
        });


};

const addCouponsGet = (req, res) => {
    res.status(200).render("admin-add-coupons", { layout: "adminLayout" });

};

const addCouponsPost = (req, res) => {

    const coupon = new Offers(req.body);
    console.log(coupon);
    coupon.save()
        .then((result) => {
            res.redirect("/admin/coupons")
        })
        .catch((err) => {
            console.log('error at adding products:', err);
            res.send("error");
        });
};

const referralsGet = (req, res) => {
    refferals.find()
        .then((data) => {
            res.status(200).render("referals-approvals", { layout: "adminLayout", data });
        });
};

const approveReferralsGet = (req, res) => {
    refferals.findOneAndUpdate({_id: req.params.id}, { $set: { status: "Approved" } },{ returnOriginal: false })
        .then((result)=>{
            users.findOneAndUpdate({phone: result.userPhone}, { $inc: { wallet: result.eligibleCredit } })
                .then((data)=>{
                    console.log("sdfsdfsd",data);
                    res.redirect("/admin/referrals");

                });
            
        });
};

const rejectReferralsGet = (req, res)=>{
    refferals.findOneAndUpdate({_id: req.params.id}, { $set: { status: "Rejected" } })
        .then(()=>{
            res.redirect("/admin/referrals");
        });
};

module.exports = {
    deleteProductsGet,
    editProductsGet,
    editProductsPost,
    blockUser,
    usersGet,
    addproductsPost,
    addproductsGet,
    logoutGet,
    productsGet,
    loginPost,
    loginGet,
    ordersGet,
    deliveredGet,
    cancelGet,
    salesReport,
    chartDataGet,
    adminHome,
    categoriesGet,
    orderDetailsGet,
    refundApprovals,
    InitiateRefundGet,
    categorySearchGet,
    couponsGet,
    addCouponsGet,
    addCouponsPost,
    referralsGet,
    approveReferralsGet,
    rejectReferralsGet
};


