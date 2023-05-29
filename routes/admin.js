const exp = require('express');
const router = exp.Router();

const adminUsername= "admin";
const adminPassword= "pass";
router.get("/", (req, res)=>{console.log("inside get / of admin");
    if(req.session.loggedIn)
        res.render("adminHome", {layout: "adminLayout"});
    else
        res.redirect("/admin/login");
});

router.get("/login", (req, res)=>{console.log("inside get login");
    if(req.session.loggedIn)
        res.redirect("/admin");
    else
    {
        res.render("adminLogin", {layout: false});
    }
});

router.post("/login", (req, res)=>{console.log("inside post login");
    if(req.body.username === adminUsername && req.body.password === adminPassword)
    {
        req.session.loggedIn = true;
        res.redirect("/admin");console.log("verified");
    }
    else
    {   
        res.redirect("/admin/login");
        console.log("invalid credentials");
    }
});


router.get("/products", (req, res)=>{console.log("inside get of /product");
    if(req.session.loggedIn)
        res.render("adminProducts", {layout: "adminLayout"});
    else
        res.redirect("/admin/login");
});


router.get("/logout", (req, res)=>{console.log("inside get logout");
    req.session.destroy();
    res.redirect("/admin/login");
});

module.exports = router;