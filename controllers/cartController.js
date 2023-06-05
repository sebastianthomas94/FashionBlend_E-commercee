const user = require("../model/user");

const productPost = (req, res) => {
    
    user.updateOne({ phone: req.session.phone }, {
        $push:{cart:[req.body]}
    })
        .then((result) => {
            console.log("saved", result);
            res.status(200);
        })
        .catch((err)=>{
            console.log(err);
        });

};

module.exports = {
    productPost
};
