const exp = require('express');
const router = exp.Router();
const { userLoggin } = require("../middleware/general");
const { productPost, 
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
        applyCouponsGet } = require("../controllers/cartController");


router.post("/addproduct",userLoggin, productPost);

router.get("/addproduct/:id",userLoggin, addToCartGetWhishlist);

router.get("/", userLoggin,cartGet);

router.post("/pill",userLoggin,pillPost );

router.post("/delete", userLoggin, deletePost);

router.get("/selectaddress", userLoggin, selectAddressPost);

router.post("/addaddress", userLoggin,addAddressPost );

router.get("/addaddress", userLoggin,addAddressGet );

router.get("/editaddress/:id", userLoggin, editAddressGet);

router.get("/deleteaddress/:id", userLoggin,deleteAddressGet);

router.post("/editaddress/:id", userLoggin,editAddressPost );

router.get("/cod/orderplaced", userLoggin, orderPlacedGet);

router.get("/wishlist",userLoggin,wishlistGet);

router.get("/wishlist/:id", userLoggin, addToWishlistGet);

router.post("/onlinepayment",userLoggin, onlinePaymentPost)

router.post("/onlinepayment/orderplaced",userLoggin, orderPlacedOnline);

router.get("/orderplacedonline",userLoggin,(req,res)=>{
        res.render("orderPlaced", { loggedIn: req.session.loggedIn });
})

router.get("/wishlist/delete/:id",userLoggin, deleteWishlistGet);

router.get("/wishlist/carttowishlist/:id", userLoggin, cartToWishlistGet);

router.get("/changequantity",userLoggin, changeQuantityGet);

router.get("/applycoupon",userLoggin,applyCouponsGet);

module.exports = router;