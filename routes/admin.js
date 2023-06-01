const exp = require('express');
const router = exp.Router();
const multer = require("multer");
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
        loginGet} = require("../controllers/adminControllers");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, "./public/img/products");
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}.${file.originalname}`);
    }
});

const upload = multer({ storage: storage });




router.get("/", validateLoggin, (req, res) => {
    res.render("adminHome", { layout: "adminLayout" });

});

router.get("/login", loginGet);

router.post("/login",loginPost);


router.get("/products", validateLoggin, productsGet);


router.get("/logout",logoutGet);

router.get("/addproducts", validateLoggin, addproductsGet);

router.post("/addproducts/add", upload.single('img'),addproductsPost);

router.get("/users", validateLoggin, usersGet);

router.get("/blockuser/:id", validateLoggin, blockUser);

router.get("/products/edit/:id", validateLoggin, editProductsGet);

router.post("/products/edit/:id", validateLoggin, editProductsPost);



router.get("/products/delete/:id", validateLoggin, deleteProductsGet);

module.exports = router;