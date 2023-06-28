

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

const pageNation = (pageNo, capacity, aggrigation,schema) => {console.log("aggrigation called");
    return new Promise( (res, rej) => {
         schema.aggregate(aggrigation).skip((pageNo - 1) * capacity).limit(capacity)
            .then(async(result) => {
                res([result, await schema.aggregate(aggrigation).count("count")]);
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