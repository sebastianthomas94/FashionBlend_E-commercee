const product = require("../model/products");
const users = require("../model/user");

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

const productsGet = (req, res) => {

    product.find()
        .then((result) => {
            res.render("adminProducts", { layout: "adminLayout", products: result });
        })
        .catch((err) => console.log(err));
};

const logoutGet = (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
};

const addproductsGet = (req, res) => {
    res.render("addProducts", { layout: "adminLayout" });
};

const addproductsPost = (req, res) => {
    const newProduct = new product({
        name: req.body.name,
        price: req.body.price,
        categories: [req.body.categories],
        size: req.body.size,
        img: [req.file.originalname],
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
    loginGet
    };