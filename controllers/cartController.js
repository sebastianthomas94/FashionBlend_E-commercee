const user = require("../model/user");
const products = require("../model/products");

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
            console.log(productIdFromCart);
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
    console.log("inside delete");
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
    console.log("id from address", req.params.id);
    user.findOne(
        { 'address._id': req.params.id },
        { 'address.$': 1 }
    )
        .then((result) => {
            console.log("THE ADDRESS DETAILS", result.address[0]);
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
        .then((result) => {});
    res.redirect("/cart/selectaddress");
};

const orderPlacedGet = (req, res) => {
    user.findOne({ _id: req.session._id })
        .then((result) => {
            result.orders.push(...result.cart);
            result.cart = [];
            result.save()
                .then(() => {
                    res.render("orderPlaced", { loggedIn: req.session.loggedIn });
                    /*             setTimeout(() => {
                                    res.redirect('/');
                                  }, 3000); // Delay for 3 seconds (3000 milliseconds */
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

const wishlistGet = (req, res) => {
     user.findOne({_id: req.session._id})
        .then((data) => {
            if(data.wishlist.length)
            {
                const idsToFind = data.wishlist.map(doc => doc.id);
                products.find({ _id: { $in: idsToFind } })
                    .then((result) => {
                        res.render("wishlist", { loggedIn: req.session.loggedIn, wishlist: result });

                    });
            }
            else
                res.render("emptyWishlist",{ loggedIn: req.session.loggedIn});
        });
    

};

const addToWishlistGet = (req, res) => {
    const previousPageUrl = req.headers.referer || '/';
    const wishlist={
        id:req.params.id,
        size: req.params.size
    };
    user.findOne({_id: req.session._id})
        .then((result) => {
            if (!result.wishlist.some((obj)=> obj.id === req.params.id))
            {
                user.updateOne({_id: req.session._id},
                    {$push:{wishlist: wishlist}})
                    .then(()=>{
                        res.redirect(previousPageUrl);
                    });
            }
            else 
            { 
                res.redirect(previousPageUrl);
            }

        });
    
};

const addToCartGetWhishlist = (req,res) =>{
    user.updateOne(
        { _id: req.session._id },
        { $pull: { wishlist: {id: req.params.id} },
        $push: { cart:{id: req.params.id, numbers: 1, size:"m" }}})
        .then(()=>{
            res.redirect("/cart/wishlist");
        });
    


};

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
    addToCartGetWhishlist

};
