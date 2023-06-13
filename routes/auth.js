const exp = require('express');
const router = exp.Router();
const {userLoggin} =require("../middleware/general");
const {
    logoutGet,
    newUserPost,
    verifyPost,
    authPost,
    profileGet} = require("../controllers/authControllers");


router.post("/", authPost);

router.post("/verify", verifyPost);

router.post("/newuser", newUserPost);

router.get("/logout", logoutGet);

router.get("/profile",userLoggin,profileGet);


module.exports = router;



//make middlewaeas for blocked and loggedin

function loggedin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect("/");

}

