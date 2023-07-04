const exp = require('express');
const router = exp.Router();
const {userLoggin} =require("../middleware/general");
const {
    logoutGet,
    newUserPost,
    verifyPost,
    authPost,
    profileGet,
    ordersGet,
    generateReferralPage,
    generateReferralURL} = require("../controllers/authControllers");


router.post("/", authPost);

router.post("/verify", verifyPost);

router.post("/newuser", newUserPost);

router.get("/logout", logoutGet);

router.get("/profile",userLoggin,profileGet);

router.get("/profile/orders",userLoggin,ordersGet);

router.get("/referal-code-generator",userLoggin, generateReferralPage);

router.get("/referal-code-generator/:phone",userLoggin, generateReferralURL);




module.exports = router;



//make middlewaeas for blocked and loggedin

function loggedin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect("/");

}

