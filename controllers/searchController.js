const products= require("../model/products");

const querySearch=(req,res)=>{
    const query = req.query.query;
    const regex = new RegExp(query, 'i');
    products.find({
    $or: [
          { name: { $regex: regex } },
          { 'moreInfo.description': { $regex: regex } }
        ]
      })
      .then((result)=>{
        res.render("sampleProducts", { loggedIn: req.session.loggedIn, products: result, totalPages: 1, pageNo: 1, count: result.length });
      })
    }

module.exports = {
    querySearch
};