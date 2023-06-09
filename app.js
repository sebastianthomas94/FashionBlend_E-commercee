const express = require("express");
const mongo=require("mongoose");
const path= require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const home = require("./routes/home");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const products = require("./routes/products");
const user = require("./model/user");
const cart = require("./routes/cart");
const search = require("./routes/search");
const app = express();

app.set("view engine", "ejs");     
app.set("views",path.join(__dirname, "views")); 
app.use(expressLayouts);
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(session({
    secret: 'my-secret-key', // Change this to a strong secret in production
    resave: false,
    saveUninitialized: false
  }));
app.use((req, res, next) => {
    res.header('Cache-control', 'no-cache,private,no-store,must-revalidate,max-stale=0, post-check=0,pre-check=0');
    next();
});
app.use("/admin", admin);
app.use((req, res, next)=>{
    if(req.session.loggedIn)        //banned middlewear
    {
        user.find({phone: req.session.phone})
        .then((result)=>{
            if(result[0].ban)
                res.render('banned',{layout: false});
            else
                next();
        });
    }
    else
        next();
});
app.use((req, res, next)=>{
    if(req.query.ref)
        req.session.ref=req.query.ref;
    next();
});
app.use("/", home);
app.use("/auth", auth);

app.use("/products", products);
app.use("/cart", cart);
app.use("/search", search);

const url = "mongodb+srv://kelvinthomas84:zxgsotCblngXbr2i@fashionblend.u3db1y6.mongodb.net/FasionBlend?retryWrites=true&w=majority";



 mongo.connect(url)
 .then(() => console.log('Database connected'))
 .catch((err) => console.error(err)); 




app.listen(8080,function(req,res){
    console.log("server is running at port 8080...");
});







