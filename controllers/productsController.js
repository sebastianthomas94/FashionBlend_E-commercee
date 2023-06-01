const products = require("../model/products");

const productsGet = (req, res)=>{
    products.find({ categories: { $all: ['Clothing', 'Men', 'Casual'] } })
    .then((result)=>{
        res.render("sampleProducts", {loggedIn:req.session.loggedIn, products: result});
    })
    .catch((err)=>{
        console.log(err);
    }); 
};

const productsPageGet = (req,res)=>{
    products.find({ _id:req.params.id})
    .then((result)=>{
        res.render("sampleProductPage", {loggedIn:req.sessionStore.loggedIn, product: result[0]});
    }) 
    .catch((err)=>{
        console.log(err);
    });
};

module.exports = {productsPageGet,productsGet};