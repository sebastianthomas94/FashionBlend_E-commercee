const exp = require('express');
const router = exp.Router();
const user = require("../model/user");
const {userLoggin} =require("../middleware/general");
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

router.get("/profile",userLoggin,(req,res)=>{
    user.findOne({_id:req.session._id})
    .then((result)=>{
        res.render("userProfile", {loggedIn: req.session.loggedIn, data: result});
    });
});


module.exports = router;



//make middlewaeas for blocked and loggedin

function loggedin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect("/");

}

