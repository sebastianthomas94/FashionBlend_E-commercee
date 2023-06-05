const exp = require('express');
const router = exp.Router();
const { userLoggin } = require("../middleware/general");
const { productPost } = require("../controllers/cartController");
const user = require("../model/user");
const products = require("../model/products");

router.post("/addproduct", productPost);

router.get("/", (req, res) => {
    let cart;
    let totalMRP=0;
    user.find({ phone: req.session.phone })
        .then((result) => {
            console.log(result);
            cart = result[0].cart;
            console.log("saved cart", cart);
            let productIdFromCart = cart.map((element) => {
                return element.id;

            });
            console.log(productIdFromCart);
            products.find({ _id: { $in: productIdFromCart } })
                .then((result) => {
                    console.log("results from cart====",result);
                    let data = cart.map((obj) => {
                        var matchingObject = result.find(item => item.id === obj.id);
                        totalMRP+=matchingObject.price;
                        return { id: obj.id, numbers: obj.numbers,size:obj.size, price: matchingObject.price, img: matchingObject.img };
                    });
                    //res.send(data);
                    res.render("cart", { loggedIn: req.session.loggedIn, products: data, total:totalMRP});
                })
                .catch((err) => { console.log(err) })
        })
        .catch((err) => { console.log(err); });



});

router.post("/pill", (req, res)=>{
    user.find({ phone: "91"+req.body.phoneNumber })
        .then((result) => {
            res.send({"number": result[0].cart.length});
        })
});


module.exports = router;