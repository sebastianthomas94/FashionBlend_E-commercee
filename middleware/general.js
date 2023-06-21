const products = require("../model/products");


const validateLoggin = (req, res, next) => {
    if (req.session.adminLoggedIn) {
        next();
    }
    else {
        res.redirect("/admin/login");
    }
};

const userLoggin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    }
    else {
        res.redirect("/");
    }
};

const pageNation = (pageNo, capacity, aggrigation) => {
    return new Promise( (res, rej) => {
         products.aggregate(aggrigation).skip((pageNo - 1) * capacity).limit(capacity)
            .then(async(result) => {
                res([result, await products.aggregate(aggrigation).count("count")]);
            })
            .catch((err) => {
                rej(err);
            });


    }
    )
};
module.exports = {
    validateLoggin,
    userLoggin,
    pageNation
};