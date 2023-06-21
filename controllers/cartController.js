const user = require("../model/user");
const products = require("../model/products");
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
                        totalMRP += (matchingObject.price * obj.numbers);
                        return { id: obj.id, numbers: obj.numbers, size: obj.size, price: matchingObject.price, img: matchingObject.img, _id: obj._id };
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
            if (!result[0].address.length)
                res.redirect("/cart/addaddress");
            for (let i in result[0].address) {
                if (result[0].address[i].default)
                    defaultAddress.push(result[0].address[i]);
                else
                    otherAddress.push(result[0].address[i]);
            }
            res.render("selectaddress", { loggedIn: req.session.loggedIn, total: req.session.totalMRP, defaultAddress: defaultAddress[0], otherAddress })

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
    user.findOne({ _id: req.session._id })
        .then(async (result) => {
            const cart = result.cart;
            const orders = await Promise.all(cart.map(async(item) => {
                let price;
                let oneProduct= await products.findOne({_id: item.id});
                price = ((oneProduct.price*0.01*(100-oneProduct.moreInfo.discount)).toFixed(2))*item.numbers;
                console.log(price);
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

const onlinePaymentPost = (req, res) => {
    const total = req.body.total * 100;
    var options = {
        amount: total,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function (err, order) {
        res.json(order);
    });

};

const orderPlacedOnline = async (req, res) => {
    const dateNow = dateAndTime(new Date());
    const ETADate = dateAndTime(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
    user.findOne({ _id: req.session._id })
        .then(async (result) => {
            const cart = result.cart;
            const orders = await Promise.all(cart.map(async(item) => {
                let price;
                let oneProduct= await products.findOne({_id: item.id});
                price = ((oneProduct.price*0.01*(100-oneProduct.moreInfo.discount)).toFixed(2));
                console.log(price);
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
    orderPlacedOnline

};
