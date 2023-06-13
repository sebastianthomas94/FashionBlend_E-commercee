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
        addToCartGetWhishlist } = require("../controllers/cartController");


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

router.get("/orderplaced", userLoggin, orderPlacedGet);

router.get("/wishlist",userLoggin,wishlistGet);

router.get("/wishlist/:id", userLoggin, addToWishlistGet);

module.exports = router;