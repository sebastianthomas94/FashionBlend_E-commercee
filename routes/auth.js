const exp = require('express');
const router = exp.Router();
const {
    logoutGet,
    newUserPost,
    verifyPost,
    authPost
} = require("../controllers/authControllers");


router.post("/", authPost);

router.post("/verify", verifyPost);

router.post("/newuser", newUserPost);

router.get("/logout", logoutGet);


module.exports = router;



//make middlewaeas for blocked and loggedin

function loggedin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect("/");

}

