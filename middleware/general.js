const validateLoggin = (req, res, next) => {
    if (req.session.adminLoggedIn) {
        next();
    }
    else
    {
        res.redirect("/admin/login");
    }
};

const userLoggin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    }
    else
    {
        res.redirect("/");
    }
};
module.exports = {
    validateLoggin,userLoggin};