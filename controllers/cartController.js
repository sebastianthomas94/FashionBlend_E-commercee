const user = require("../model/user");
const products = require("../model/products");
const offers = require("../model/offers");
const referrals = require("../model/referrals");
const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id: 'rzp_test_uN7cMKTYFIHGa4',
    key_secret: 'VGQj892OZjoEVCIP254nK7Kd',
});

const productPost = (req, res) => {

    user.updateOne({ phone: req.session.phone }, {
        $push: { cart: [req.body] }
    })
        .then((result) => {
            res.status(200);
        })
        .catch((err) => {
            console.log(err);
        });

};

const loggedIn = (req, res, next) => {
    if (req.session.phone)
        next();
    else
        res.redirect("/");
};

const cartGet = (req, res) => {
    let cart;
    let totalMRP = 0;
    user.find({ phone: req.session.phone })
        .then((result) => {
            cart = result[0].cart;
            let productIdFromCart = cart.map((element) => {
                return element.id;

            });
            products.find({ _id: { $in: productIdFromCart } })
                .then((result) => {
                    let data = cart.map((obj) => {
                        var matchingObject = result.find(item => item.id === obj.id);
                        totalMRP += ((matchingObject.price * (1 - (matchingObject.moreInfo.discount / 100))) * obj.numbers);
                        let size;
                        switch (obj.size) {
                            case ("xs"): size = "Extra Small";
                                break;
                            case ("s"): size = "Small";
                                break;
                            case ("m"): size = "Medium";
                                break;
                            case ("l"): size = "Large";
                                break;
                            case ("xl"): size = "Extra Large";
                                break;
                        }
                        return { id: obj.id, numbers: obj.numbers, size: size, price: matchingObject.price, img: matchingObject.img, _id: obj._id, name: matchingObject.name, discount: matchingObject.moreInfo.discount };
                    });
                    //res.send(data);
                    totalMRP = totalMRP.toFixed(2);
                    req.session.totalMRP = totalMRP;
                    res.render("cart", { loggedIn: req.session.loggedIn, products: data, total: totalMRP });
                })
                .catch((err) => { console.log(err) })
        })
        .catch((err) => { console.log(err); });

};

const pillPost = (req, res) => {
    user.find({ phone: "91" + req.body.phoneNumber })
        .then((result) => {
            res.send({ "number": result[0].cart.length });
        })
};

const deletePost = (req, res) => {
    const _id = req.body.id;
    user.findOneAndUpdate(
        { phone: req.session.phone },
        { $pull: { cart: { _id: _id } } },
        { new: true })
        .then((result) => {
            res.end();
        })
        .catch((err) => {
            console.log(err);
        });
};
const selectAddressPost = (req, res) => {
    user.find({ phone: req.session.phone })
        .then((result) => {
            const defaultAddress = [];
            const otherAddress = [];
            if (!result[0].address.length) {
                res.redirect("/cart/addaddress");
                return;
            }
            for (let i in result[0].address) {
                if (result[0].address[i].default)
                    defaultAddress.push(result[0].address[i]);
                else
                    otherAddress.push(result[0].address[i]);
            }
            let walletDiscount;
            if (result[0].wallet > 0) {
                walletDiscount = result[0].wallet >= req.session.totalMRP ? req.session.totalMRP : result[0].wallet;
            }
            res.render("selectaddress", { loggedIn: req.session.loggedIn, total: req.session.totalMRP, defaultAddress: defaultAddress[0], otherAddress, walletDiscount: walletDiscount })

        });
};

const addAddressPost = (req, res) => {
    user.findByIdAndUpdate(req.session._id,
        { $push: { address: req.body } },
        { new: true })
        .then((result) => {
            res.redirect("/cart/selectaddress");
        })
        .catch((err) => {
            console.log(err);
        });
};

const addAddressGet = (req, res) => {
    res.render("addressForm", { loggedIn: req.session.loggedIn });
};

const editAddressGet = (req, res) => {
    user.findOne(
        { 'address._id': req.params.id },
        { 'address.$': 1 }
    )
        .then((result) => {
            res.render("editAddressForm", { loggedIn: req.session.loggedIn, address: result.address[0] });
        })
        .catch((err) => {
            console.log("error from address fetch", err);
        });
};

const deleteAddressGet = (req, res) => {
    user.updateOne({}, { $pull: { address: { _id: req.params.id } } })
        .then(() => {
            res.redirect("/cart/selectaddress");
        })
        .catch((err) => {
            console.log(err);
        });
}

const editAddressPost = (req, res) => {
    user.updateOne(
        { 'address._id': req.params.id },
        { $set: { 'address.$': req.body } })
        .then((result) => { });
    res.redirect("/cart/selectaddress");
};

const orderPlacedGet = (req, res) => {
    const dateNow = dateAndTime(new Date());
    const ETADate = dateAndTime(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
    if (req.session.ref)
        addReferalPoints(req.session.totalMRP, req.session._id, req.session.ref);
    user.findOne({ _id: req.session._id })
        .then(async (result) => {
            if (result.wallet > 0) {
                if (result.wallet >= req.session.totalMRP) {
                    await user.findOneAndUpdate(
                        { _id: req.session._id },  // Specify the document you want to update
                        { $inc: { wallet: -req.session.totalMRP } }
                    )
                        .then((data) => {

                        });
                }
                else {
                    await user.findOneAndUpdate(
                        { _id: req.session._id },  // Specify the document you want to update
                        { $set: { wallet: 0 } }
                    )
                    req.sessions.totalMRP -= reslult.wallet;
                }
            }
            const cart = result.cart;
            const orders = await Promise.all(cart.map(async (item) => {
                let price;
                let oneProduct = await products.findOne({ _id: item.id });
                price = ((oneProduct.price * 0.01 * (100 - oneProduct.moreInfo.discount)).toFixed(2)) * item.numbers;
                updateQuantityInWarehouse(item.id, item.numbers);
                return {
                    id: item.id,
                    numbers: item.numbers,
                    size: item.size,
                    paymentMethod: "COD",
                    date: dateNow.date,
                    ETA: ETADate.date,
                    time: dateNow.time,
                    amount: price

                };
            }));
            user.updateOne(
                { _id: req.session._id }, // Specify the document to update based on its _id
                {
                    $push: { orders: [...orders] }, // Push an array of order documents
                    $set: { cart: [] } // Empty the cart field by setting it as an empty array
                }
            )
                .then(() => {
                    res.status(200).redirect("/cart/orderplacedonline");
                });
        });
};

const wishlistGet = (req, res) => {
    user.findOne({ _id: req.session._id })
        .then((data) => {
            if (data.wishlist.length) {
                const idsToFind = data.wishlist.map(doc => doc.id);
                products.find({ _id: { $in: idsToFind } })
                    .then((result) => {
                        res.render("wishlist", { loggedIn: req.session.loggedIn, wishlist: result });

                    });
            }
            else
                res.render("emptyWishlist", { loggedIn: req.session.loggedIn });
        });


};

const addToWishlistGet = (req, res) => {
    const previousPageUrl = req.headers.referer || '/';
    const wishlist = {
        id: req.params.id,
        size: req.params.size
    };
    user.findOne({ _id: req.session._id })
        .then((result) => {
            if (!result.wishlist.some((obj) => obj.id === req.params.id)) {
                user.updateOne({ _id: req.session._id },
                    { $push: { wishlist: wishlist } })
                    .then(() => {
                        res.redirect(previousPageUrl);
                    });
            }
            else {
                res.redirect(previousPageUrl);
            }

        });

};

const addToCartGetWhishlist = (req, res) => {
    user.updateOne(
        { _id: req.session._id },
        {
            $pull: { wishlist: { id: req.params.id } },
            $push: { cart: { id: req.params.id, numbers: 1, size: "m" } }
        })
        .then(() => {
            res.redirect("/cart/wishlist");
        });
};

const onlinePaymentPost = async (req, res) => {
    console.log("entered");
    var total = req.body.total * 100;
    const usersData = await user.findOne({ _id: req.session._id });
    if (usersData.wallet > 0) {
        if (usersData.wallet >= req.body.total) {
            await user.findOneAndUpdate(
                { _id: req.session._id },  // Specify the document you want to update
                { $inc: { wallet: -req.session.totalMRP } }
            )
            total = 0;
        }
        else {
            await user.findOneAndUpdate(
                { _id: req.session._id },  // Specify the document you want to update
                { $set: { wallet: 0 } }
            )
            total -= (usersData.wallet * 100);
        }
    }
    console.log(total);
    var options = {
        amount: total,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function (err, order) {
        console.log("instance created", order);
        res.json(order);
    });

};

const orderPlacedOnline = async (req, res) => {
    const dateNow = dateAndTime(new Date());
    const ETADate = dateAndTime(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
    if (req.session.ref)
        addReferalPoints(req.session.totalMRP, req.session._id, req.session.ref);
    user.findOne({ _id: req.session._id })
        .then(async (result) => {
            const cart = result.cart;
            const orders = await Promise.all(cart.map(async (item) => {
                let price;
                let oneProduct = await products.findOne({ _id: item.id });
                price = ((oneProduct.price * 0.01 * (100 - oneProduct.moreInfo.discount)).toFixed(2));
                updateQuantityInWarehouse(item.id, item.numbers);
                return {
                    id: item.id,
                    numbers: item.numbers,
                    size: item.size,
                    paymentID: req.body.response.razorpay_payment_id,
                    paymentMethod: "Online",
                    date: dateNow.date,
                    ETA: ETADate.date,
                    time: dateNow.time,
                    amount: price

                };
            }));
            user.updateOne(
                { _id: req.session._id }, // Specify the document to update based on its _id
                {
                    $push: { orders: [...orders] }, // Push an array of order documents
                    $set: { cart: [] } // Empty the cart field by setting it as an empty array
                }
            )
                .then((result) => {
                    res.status(200).json({ data: "done" });
                });


        });


};

function dateAndTime(date_) {

    const currentDate = new Date(date_); // Convert the timestamp to a Date object

    // Extract date components
    const day = currentDate.getDate(); // Get the day of the month
    const month = currentDate.getMonth() + 1; // Get the month (months are zero-based, so adding 1)
    const year = currentDate.getFullYear(); // Get the four-digit year

    // Extract time components
    const hours = currentDate.getHours(); // Get the hour (0-23)
    const minutes = currentDate.getMinutes(); // Get the minutes

    const date = `${day}-${month}-${year}`;
    const time = `${hours}:${minutes}`;
    return { date, time };
}

function updateQuantityInWarehouse(id, number) {
    products.updateOne(
        { _id: id }, // Specify the document to update based on its _id
        { $inc: { quantity: -number } } // Decrement the value of the field by 10
    )
        .then((result) => console.log("sdfsdfasdfsda", result))
        .catch((err) => console.log(err));
}

const deleteWishlistGet = (req, res) => {
    user.updateOne(
        { _id: req.session._id },
        {
            $pull: { wishlist: { id: req.params.id } }
        })
        .then(() => res.status(200).redirect("/cart/wishlist"));
};

const cartToWishlistGet = (req, res) => {
    user.updateOne(
        { _id: req.session._id },
        {
            $push: { wishlist: { id: req.params.id } },
            $pull: { cart: { id: req.params.id } }
        }
    )
        .then((result) => {
            res.status(200).redirect("/cart")
        });
};


const changeQuantityGet = (req, res) => {
    user.updateOne(
        { _id: req.session._id, "cart._id": req.query.id },
        {
            $set: { "cart.$.numbers": req.query.newVal }
        }
    )
        .then((result) => {
            res.status(200).send({ succes: "done" });
        });

};

const applyCouponsGet = (req, res) => {

    offers.findOne({ voucherCode: req.query.code })
        .then((coupon) => {
            console.log(coupon);
            if (!coupon) {
                res.status(200).send({ message: "Coupon not vaild", valid: false });
                return;
            }
            if (req.session.totalMRP < coupon.minSpent) {
                res.status(200).send({
                    message: `Spend ${coupon.minSpent - req.session.totalMRP} more to avail this offer!`,
                    valid: false
                });
                return;
            }
            if (new Date() < new Date(coupon.startTime) || new Date() > new Date(coupon.endTime)) {
                res.status(200).send({
                    message: `This coupon is only valid from ${coupon.startTime.toLocaleDateString()} to ${coupon.endTime.toLocaleDateString()}!`,
                    valid: false
                });
                return;
            }
            if (req.session.appliedCoupon) {
                res.status(200).send({
                    message: `Another coupon is alredy applied`,
                    valid: false
                });
                return;
            }
            if (req.session.appliedCoupon == req.query.code) {
                res.status(200).send({
                    message: `This coupon was already applied`,
                    valid: false
                });
                return;
            }
            req.session.appliedCoupon = req.query.code;


            const prevTotal = req.session.totalMRP;
            if (coupon.priceType == "flat")
                req.session.totalMRP -= coupon.price;
            else if (coupon.priceType == "percentage")
                req.session.totalMRP = (req.session.totalMRP * (1 - (coupon.price / 100))).toFixed(2);
            res.status(200).send({
                message: 'Coupon code applied successfully!',
                newTotal: req.session.totalMRP,
                discount: prevTotal - req.session.totalMRP,
                valid: true,
            });
        });

};


function addReferalPoints(total, userId, referalId) {
    //const buyer = await user.findOne({ _id: userId });
    user.findOne({ referalCode: referalId })
        .then((referrer) => {
            const newReferral = new referrals({
                name: referrer.name,
                email: referrer.email,
                userPhone: referrer.phone,
                userId,
                eligibleCredit: (total * 0.15).toFixed(2),
                total,
                date: new Date()
            });
            console.log(userId == referrer._id, userId, referrer._id, newReferral);
            if (userId != referrer._id)
                newReferral.save();

        })


}

module.exports = {
    productPost,
    loggedIn,
    cartGet,
    pillPost,
    deletePost,
    selectAddressPost,
    addAddressPost,
    addAddressGet,
    editAddressGet,
    deleteAddressGet,
    editAddressPost,
    orderPlacedGet,
    wishlistGet,
    addToWishlistGet,
    addToCartGetWhishlist,
    onlinePaymentPost,
    orderPlacedOnline,
    deleteWishlistGet,
    cartToWishlistGet,
    changeQuantityGet,
    applyCouponsGet
};
