const exp = require('express');
const router = exp.Router();
const { userLoggin } = require("../middleware/general");
const { productPost } = require("../controllers/cartController");
const user = require("../model/user");
const products = require("../model/products");

router.post("/addproduct", productPost);

router.get("/", userLoggin, (req, res) => {
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



});

router.post("/pill", (req, res) => {
    user.find({ phone: "91" + req.body.phoneNumber })
        .then((result) => {
            res.send({ "number": result[0].cart.length });
        })
});

router.post("/delete", userLoggin, (req, res) => {
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
});

router.get("/selectaddress", userLoggin, (req, res) => {
    user.find({ phone: req.session.phone })
        .then((result) => {
            const defaultAddress = [];
            const otherAddress = [];
            for (let i in result[0].address) {
                if (result[0].address[i].default)
                    defaultAddress.push(result[0].address[i]);
                else
                    otherAddress.push(result[0].address[i]);
            }
            res.render("selectaddress", { loggedIn: req.session.loggedIn, total: req.session.totalMRP, defaultAddress: defaultAddress[0], otherAddress })

        })
        ;
});

router.post("/addaddress", userLoggin, (req, res) => {
    user.findByIdAndUpdate(req.session._id,
        { $push: { address: req.body } },
        { new: true })
        .then((result) => {
            res.redirect("/cart/selectaddress");
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get("/addaddress", userLoggin, (req, res) => {
    res.render("addressForm", { loggedIn: req.session.loggedIn });
});

router.get("/editaddress/:id", userLoggin, (req, res) => {
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
});

router.get("/deleteaddress/:id", userLoggin, (req, res) => {
    user.updateOne({}, { $pull: { address: { _id: req.params.id } } })
        .then(() => {
            res.redirect("/cart/selectaddress");
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/editaddress/:id", userLoggin, (req, res) => {
    user.updateOne(
        { 'address._id': req.params.id },
        { $set: { 'address.$': req.body } })
        .then((result) => { console.log("asfdhdshflkdsa", result) });
    res.redirect("/cart/selectaddress");
});

router.get("/orderplaced", userLoggin, (req, res) => {
    user.findOne({ _id: req.session._id })
        .then((result)=>{console.log("from prderplaced",result);
        result.orders.push(...result.cart);
        result.cart = [];
        result.save()
          .then(()=>{
            res.render("orderPlaced", { loggedIn: req.session.loggedIn})
          });
        })
        .catch((err)=>{
            console.log(err);
        });
          



});

module.exports = router;