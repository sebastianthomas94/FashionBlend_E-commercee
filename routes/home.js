const exp = require('express');
const router = exp.Router();

router.get("/", (req,res) => { 
    res.render("home",{loggedIn:req.session.loggedIn});
});


module.exports = router;