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
    
    const [products,totalCount] = await pageNation(pageNo, capacity, aggrigateStages);
    const totalPages = Math.floor(parseInt(totalCount[0].count)/capacity)+1;
    res.render("sampleProducts", { loggedIn: req.session.loggedIn, products: products, totalPages, pageNo });

};

const productsPageGet = (req, res) => {
    products.find({ _id: req.params.id })
        .then((result) => {
            res.render("sampleProductPage", { loggedIn: req.session.loggedIn, product: result[0] });
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = { productsPageGet, productsGet };