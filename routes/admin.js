const exp = require('express');
const router = exp.Router();
const multer = require("multer");
const user = require("../model/user");
const { validateLoggin } = require("../middleware/general");
const { deleteProductsGet,
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
        rejectReferralsGet} = require("../controllers/adminControllers");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, "./public/img/products");
    },
    filename: (req, files, cb) => {
        return cb(null, `${Date.now()}.${files.originalname}`);
    }
});

const upload = multer({ storage: storage });




router.get("/", validateLoggin, adminHome );


router.get("/login", loginGet);

router.post("/login",loginPost);


router.get("/products", validateLoggin, productsGet);


router.get("/logout",logoutGet);

router.get("/addproducts", validateLoggin, addproductsGet);

router.post("/addproducts/add", upload.array('img',4),addproductsPost);

router.get("/users", validateLoggin, usersGet);

router.get("/blockuser/:id", validateLoggin, blockUser);

router.get("/products/edit/:id", validateLoggin, editProductsGet);

router.post("/products/edit/:id", validateLoggin, editProductsPost);



router.get("/products/delete/:id", validateLoggin, deleteProductsGet);

router.get("/orders",validateLoggin,ordersGet);

router.get("/orders/delivered/:id",deliveredGet);

router.get("/orders/cancel/:id",cancelGet);



router.get("/report/:period",validateLoggin,salesReport);

router.get("/chartdata",validateLoggin,chartDataGet);

router.get("/categories",validateLoggin,categoriesGet);

router.get("/orders/:userId/:orderId",validateLoggin, orderDetailsGet );

router.get("/refund-approvals",validateLoggin, refundApprovals );

router.get("/refund-approvals/:orderID",validateLoggin, InitiateRefundGet );

router.get("/category/search",validateLoggin, categorySearchGet );

router.get("/coupons",validateLoggin, couponsGet );

router.get("/coupons/addcoupons",validateLoggin, addCouponsGet );

router.post("/coupons/addCoupons", validateLoggin, addCouponsPost);

router.get("/referrals",validateLoggin, referralsGet);

router.get("/referrals/approve/:id",validateLoggin, approveReferralsGet);

router.get("/referrals/Reject/:id",validateLoggin, rejectReferralsGet);



module.exports = router;