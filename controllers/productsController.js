const products = require("../model/products");
const { pageNation } = require("../middleware/general");

const productsGet = async (req, res) => {
    const pageNo = req.params.pageNo;
    const capacity = 12;
    const aggrigateStages = [{
        $match: {
            $expr: {
                $allElementsTrue: [
                    { $map: { input: ['Clothing', 'Men', 'Casual'], as: 'category', in: { $in: ['$$category', '$categories'] } } }
                ]
            }
        }
    }];
    
    const [productForPage,totalCount] = await pageNation(pageNo, capacity, aggrigateStages, products);
    const totalPages = Math.floor(parseInt(totalCount[0].count)/capacity)+1;
    res.render("sampleProducts", { loggedIn: req.session.loggedIn, products: productForPage, totalPages, pageNo, count: totalCount[0].count });

};

const productsPageGet = (req, res) => {
    products.findOne({ _id: req.params.id })
        .then((result) => {
            res.render("sampleProductPage", { loggedIn: req.session.loggedIn, product: result });
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = { productsPageGet, productsGet };