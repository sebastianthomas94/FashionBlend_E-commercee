const exp = require('express');
const router = exp.Router();
const {userLoggin} = require("../middleware/general");
const {productPost} = require("../controllers/cartController");

router.post("/addproduct" ,productPost);

router.get("/", (req,res)=>{
    res.render("cart",{ loggedIn: req.session.loggedIn });
});


module.exports = router;